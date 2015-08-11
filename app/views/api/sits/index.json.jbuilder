json.array! @sits do |sit|
  json.partial!('sit', sit: sit, show_user: true)
end
