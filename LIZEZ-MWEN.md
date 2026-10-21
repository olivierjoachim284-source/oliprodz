# Oli Prod'z: mete app la sou entènèt ak peman MonCash otomatik

## 1. Mete sit la sou Vercel
1. Kreye yon kont gratis sou vercel.com.
2. Mete dosye sa a nan yon depo GitHub (oswa sèvi ak "vercel" CLI), epi chwazi "Import Project".
3. Pa bezwen okenn Build Command. Vercel pran index.html ak dosye api/ yo otomatikman.

## 2. Mete kle MonCash yo
1. Nan MonCash Business, kreye yon "Application" pou jwenn Client ID ak Client Secret (kòmanse nan sandbox).
2. Nan Vercel > Settings > Environment Variables, ajoute MONCASH_MODE (sandbox), MONCASH_CLIENT_ID, MONCASH_CLIENT_SECRET.
3. Redeploy pwojè a.

## 3. Return URL
Nan MonCash Business, mete Return URL la:
https://DOMEN-OU.com/api/moncash/return

## 4. Teste nan sandbox
Fè yon kòmand tès. Ou dwe wè paj MonCash la, peye, epi retounen sou app la ak "Kòmand anrejistre".
Si sa mache, chanje MONCASH_MODE pou "live", mete kle live yo, epi redeploy.

## Sa ki limite kounye a
- Kòmand yo sove nan telefòn kliyan an epi voye sou WhatsApp ou. Admin pa wè yo sou lòt aparèy anvan nou konekte Supabase.
- NatCash rete manyèl (pa gen API piblik mwen ka verifye).
- Pa janm mete MONCASH_CLIENT_SECRET nan index.html.
