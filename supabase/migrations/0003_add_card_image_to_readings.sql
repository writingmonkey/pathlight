-- Store the AI-painted, deck-matched tarot card (base64 data URL) for the
-- signed-in Full Purpose Guide.
alter table public.readings add column if not exists card_image text;
