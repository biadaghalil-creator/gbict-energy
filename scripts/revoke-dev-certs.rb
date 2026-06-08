#!/usr/bin/env ruby
# Revokes surplus *development* certificates via the App Store Connect API to
# free up the certificate cap. Distribution certificates are left untouched.
# Auth uses the same .p8 App Store Connect API key the iOS workflow already uses.
require 'openssl'; require 'json'; require 'base64'; require 'net/http'; require 'uri'

KID = ENV.fetch('ASC_KEY_ID')
ISS = ENV.fetch('ASC_ISSUER_ID')
P8  = ENV.fetch('ASC_KEY_PATH')

def b64(x) = Base64.urlsafe_encode64(x).delete('=')

def jwt
  ec = OpenSSL::PKey::EC.new(File.read(P8))
  header  = b64({ alg: 'ES256', kid: KID, typ: 'JWT' }.to_json)
  now = Time.now.to_i
  payload = b64({ iss: ISS, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }.to_json)
  input = "#{header}.#{payload}"
  der = ec.dsa_sign_asn1(OpenSSL::Digest::SHA256.digest(input))
  a = OpenSSL::ASN1.decode(der)
  r = a.value[0].value.to_s(2).rjust(32, "\x00")
  s = a.value[1].value.to_s(2).rjust(32, "\x00")
  "#{input}.#{b64(r + s)}"
end

def api(method, path)
  uri = URI("https://api.appstoreconnect.apple.com#{path}")
  req = (method == :delete ? Net::HTTP::Delete : Net::HTTP::Get).new(uri)
  req['Authorization'] = "Bearer #{jwt}"
  req['Content-Type'] = 'application/json'
  http = Net::HTTP.new(uri.host, uri.port); http.use_ssl = true
  http.request(req)
end

res = api(:get, '/v1/certificates?limit=200')
abort "List failed: #{res.code} #{res.body}" unless res.code.to_i == 200
certs = JSON.parse(res.body)['data']

puts "Found #{certs.length} certificates:"
certs.each { |c| puts "  - #{c['attributes']['certificateType']}  #{c['attributes']['displayName']}  (#{c['id']})" }

# Default is READ-ONLY (list above). Only when REVOKE=1 do we revoke, and even
# then only DEVELOPMENT certificates — distribution certs (used for the App
# Store archive) are always kept. Cloud signing recreates a dev cert fresh.
to_revoke = certs.select { |c| c['attributes']['certificateType'].to_s.include?('DEVELOPMENT') }
puts "\nDevelopment certificates eligible for revoke: #{to_revoke.length}"

if ENV['REVOKE'] == '1'
  puts "REVOKE=1 → revoking #{to_revoke.length} development certificate(s)…"
  to_revoke.each do |c|
    d = api(:delete, "/v1/certificates/#{c['id']}")
    puts "  #{d.code == '204' ? 'revoked' : "FAILED(#{d.code})"}: #{c['attributes']['displayName']} #{c['id']}"
  end
else
  puts "(dry-run — set REVOKE=1 to actually revoke. Nothing changed.)"
end
puts "Done."
