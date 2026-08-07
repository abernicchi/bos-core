begin;

create index if not exists appointments_service_id_idx
  on public.appointments (service_id);

create index if not exists messages_sender_auth_user_id_idx
  on public.messages (sender_auth_user_id);

create index if not exists service_requests_service_id_idx
  on public.service_requests (service_id);

create index if not exists tasks_assigned_to_idx
  on public.tasks (assigned_to);

create index if not exists tasks_conversation_id_idx
  on public.tasks (conversation_id);

create index if not exists tasks_created_by_idx
  on public.tasks (created_by);

commit;
