-- Pin a stable search_path on the trigger function (security advisory fix).
alter function public.set_updated_at() set search_path = '';
