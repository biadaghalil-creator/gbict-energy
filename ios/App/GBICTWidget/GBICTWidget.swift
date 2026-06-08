import WidgetKit
import SwiftUI

// MARK: - Shared App Group

private let appGroup = "group.nl.gbict.energy"
private let kToken = "widget_token"
private let kBaseURL = "widget_baseUrl"
private let kPayload = "widget_payload"   // cached last-good JSON

private func groupDefaults() -> UserDefaults? { UserDefaults(suiteName: appGroup) }

// MARK: - Model

struct WidgetData: Codable {
    struct Device: Codable { let name: String; let type: String; let connected: Bool }
    struct Today: Codable { let saved_eur: Double; let charged: Int; let sold: Int }

    var device: Device?
    var deviceCount: Int
    var today: Today
    var month_eur: Double
    var total_eur: Double
    var spotPrice: Double?

    static let placeholder = WidgetData(
        device: .init(name: "Sessy", type: "battery_sessy", connected: true),
        deviceCount: 1,
        today: .init(saved_eur: 2.14, charged: 4, sold: 3),
        month_eur: 38.60,
        total_eur: 412.00,
        spotPrice: 0.0421
    )
}

// MARK: - Entry

struct GBICTEntry: TimelineEntry {
    let date: Date
    let data: WidgetData?
    let configured: Bool
}

// MARK: - Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> GBICTEntry {
        GBICTEntry(date: Date(), data: .placeholder, configured: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (GBICTEntry) -> Void) {
        if context.isPreview {
            completion(GBICTEntry(date: Date(), data: .placeholder, configured: true))
            return
        }
        completion(entryFromCache())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GBICTEntry>) -> Void) {
        fetch { data in
            let now = Date()
            let entry: GBICTEntry
            if let data = data {
                entry = GBICTEntry(date: now, data: data, configured: true)
            } else {
                entry = entryFromCache()
            }
            // Refresh roughly every 30 minutes.
            let next = Calendar.current.date(byAdding: .minute, value: 30, to: now) ?? now.addingTimeInterval(1800)
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func entryFromCache() -> GBICTEntry {
        let d = groupDefaults()
        let token = d?.string(forKey: kToken)
        if let raw = d?.data(forKey: kPayload),
           let cached = try? JSONDecoder().decode(WidgetData.self, from: raw) {
            return GBICTEntry(date: Date(), data: cached, configured: true)
        }
        return GBICTEntry(date: Date(), data: nil, configured: token != nil)
    }

    private func fetch(_ completion: @escaping (WidgetData?) -> Void) {
        let d = groupDefaults()
        guard let token = d?.string(forKey: kToken), !token.isEmpty else {
            completion(nil); return
        }
        let base = d?.string(forKey: kBaseURL) ?? "https://gbict-energy.vercel.app"
        guard var comps = URLComponents(string: "\(base)/api/widget") else { completion(nil); return }
        comps.queryItems = [URLQueryItem(name: "token", value: token)]
        guard let url = comps.url else { completion(nil); return }

        var req = URLRequest(url: url)
        req.timeoutInterval = 12
        URLSession.shared.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let parsed = try? JSONDecoder().decode(WidgetData.self, from: data) else {
                completion(nil); return
            }
            // Cache last-good payload for offline display.
            d?.set(data, forKey: kPayload)
            completion(parsed)
        }.resume()
    }
}

// MARK: - Helpers

private func eur(_ v: Double) -> String {
    String(format: "€%.2f", v).replacingOccurrences(of: ".", with: ",")
}
private func eurKwh(_ v: Double) -> String {
    String(format: "€%.4f", v)
}

private let brandGreen = Color(red: 16/255, green: 185/255, blue: 129/255)
private let bgDeep = Color(red: 7/255, green: 8/255, blue: 13/255)
private let surface = Color(red: 13/255, green: 14/255, blue: 22/255)

// MARK: - Views

struct GBICTWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: GBICTEntry

    var body: some View {
        ZStack {
            ContainerRelativeShape().fill(bgDeep)
            content
                .padding(family == .systemSmall ? 14 : 16)
        }
    }

    @ViewBuilder private var content: some View {
        if !entry.configured {
            notConfigured
        } else if let d = entry.data {
            switch family {
            case .systemSmall: small(d)
            default: medium(d)
            }
        } else {
            VStack(spacing: 6) {
                Image(systemName: "bolt.horizontal.circle").foregroundColor(brandGreen)
                Text("Loading…").font(.caption).foregroundColor(.gray)
            }
        }
    }

    private var header: some View {
        HStack(spacing: 6) {
            Image(systemName: "leaf.fill").font(.system(size: 11)).foregroundColor(brandGreen)
            Text("GBICT Energy").font(.system(size: 11, weight: .semibold)).foregroundColor(.white.opacity(0.85))
            Spacer()
        }
    }

    private func deviceRow(_ d: WidgetData) -> some View {
        HStack(spacing: 5) {
            Circle().fill(d.device?.connected == true ? brandGreen : Color.gray).frame(width: 6, height: 6)
            Text(d.device?.name ?? "No device")
                .font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.7))
                .lineLimit(1)
        }
    }

    // Small: device + saved today
    private func small(_ d: WidgetData) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            header
            Spacer(minLength: 4)
            Text("Saved today").font(.system(size: 10)).foregroundColor(.gray)
            Text(eur(d.today.saved_eur))
                .font(.system(size: 30, weight: .bold, design: .rounded))
                .foregroundColor(brandGreen).minimumScaleFactor(0.6).lineLimit(1)
            Spacer(minLength: 6)
            HStack(spacing: 10) {
                statMini(icon: "arrow.down", label: "\(d.today.charged)", tint: brandGreen)
                statMini(icon: "arrow.up", label: "\(d.today.sold)", tint: .orange)
            }
            Spacer(minLength: 4)
            deviceRow(d)
        }
    }

    // Medium: device + saved today + charged/sold + month/total
    private func medium(_ d: WidgetData) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                header
                Spacer()
                deviceRow(d)
            }
            HStack(alignment: .top, spacing: 14) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Saved today").font(.system(size: 10)).foregroundColor(.gray)
                    Text(eur(d.today.saved_eur))
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(brandGreen).minimumScaleFactor(0.7).lineLimit(1)
                    HStack(spacing: 12) {
                        statMini(icon: "arrow.down", label: "Charged \(d.today.charged)x", tint: brandGreen)
                        statMini(icon: "arrow.up", label: "Sold \(d.today.sold)x", tint: .orange)
                    }.padding(.top, 2)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 8) {
                    kv("This month", eur(d.month_eur))
                    kv("Total", eur(d.total_eur))
                    if let sp = d.spotPrice { kv("Spot now", eurKwh(sp)) }
                }
            }
        }
    }

    private func statMini(icon: String, label: String, tint: Color) -> some View {
        HStack(spacing: 3) {
            Image(systemName: icon).font(.system(size: 9, weight: .bold)).foregroundColor(tint)
            Text(label).font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.75))
        }
    }

    private func kv(_ k: String, _ v: String) -> some View {
        VStack(alignment: .trailing, spacing: 1) {
            Text(k).font(.system(size: 9)).foregroundColor(.gray)
            Text(v).font(.system(size: 13, weight: .semibold, design: .rounded)).foregroundColor(.white)
        }
    }

    private var notConfigured: some View {
        VStack(spacing: 6) {
            Image(systemName: "leaf.fill").foregroundColor(brandGreen)
            Text("Open GBICT Energy").font(.system(size: 12, weight: .semibold)).foregroundColor(.white)
            Text("to activate the widget").font(.system(size: 10)).foregroundColor(.gray)
        }.multilineTextAlignment(.center)
    }
}

// MARK: - Widget

struct GBICTWidget: Widget {
    let kind = "GBICTWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                GBICTWidgetView(entry: entry).containerBackground(bgDeep, for: .widget)
            } else {
                GBICTWidgetView(entry: entry)
            }
        }
        .configurationDisplayName("GBICT Energy")
        .description("Your connected device and what it earned today.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct GBICTWidgetBundle: WidgetBundle {
    var body: some Widget { GBICTWidget() }
}
