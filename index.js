// daftar grup yang diizinkan
const allowedGroups = [
  "120363402847737051@g.us",
  "120363400396098762@g.us"
]

sock.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0]
  if (!m.message || m.key.fromMe) return
  const from = m.key.remoteJid
  const body = m.message.conversation || m.message.extendedTextMessage?.text

  // cek apakah grup termasuk dalam allowedGroups
  if (!allowedGroups.includes(from)) return

  // ====== FITUR TAGALL ======
  if (body === "!tagall") {
    const metadata = await sock.groupMetadata(from)
    let teks = "*Mention All Members:*\n\n"
    let mentions = []
    for (let p of metadata.participants) {
      teks += `@${p.id.split("@")[0]}\n`
      mentions.push(p.id)
    }
    await sock.sendMessage(from, { text: teks, mentions })
  }

  // ====== FITUR ANTI-TOXIC ======
  const toxic = ["anjing","goblok","tolol","babi","bangsat"]
  if (toxic.some(k => body?.toLowerCase().includes(k))) {
    await sock.sendMessage(from, { delete: m.key }) // hapus pesan
  }
})
