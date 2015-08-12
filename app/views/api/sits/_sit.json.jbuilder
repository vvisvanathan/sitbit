json.extract! sit,
              :id,
              :user_id,
              :start_time,
              :end_time,
              :is_sleep,
              :weight,
              :actx,
              :created_at,
              :updated_at

if show_user
  json.user do
    json.extract! sit.user, :id, :username, :sex
  end
end
