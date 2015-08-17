json.array! @sits do |sit|
  json.partial!('sit', sit: sit)
end
