const fs = require("fs");
const p = "src/components/builder/StylePanel.tsx";
let content = fs.readFileSync(p, "utf8");

// Old code to find and replace
const oldPart = `<div className="flex gap-2">
                        <input value={member.socials?.instagram || ""} onChange={(e) => handleItemChange("members", i, "socials", { ...member.socials, instagram: e.target.value })} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Instagram URL" />
                        <input value={member.socials?.linkedin || ""} onChange={(e) => handleItemChange("members", i, "socials", { ...member.socials, linkedin: e.target.value })} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="LinkedIn URL" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("members", { name: "Anggota Baru", role: "Jabatan", image: "https://placehold.co/200x200/1e293b/64748b?text=Team", socials: { instagram: "", linkedin: "" } })}`;

const newPart = `<div className="mb-1">
                        <label className="text-[9px] text-gray-600 block mb-0.5">Sosial Media</label>
                        {(Array.isArray(member.socials) ? member.socials : []).map((s, si) => (
                          <div key={si} className="flex items-center gap-1 mb-0.5">
                            <select
                              value={(s && s.platform) || "instagram"}
                              onChange={(e) => {
                                const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                                items[si] = { ...items[si], platform: e.target.value };
                                handleItemChange("members", i, "socials", items);
                              }}
                              className="flex-[0.4] px-1.5 py-1 rounded bg-white/5 border border-white/10 text-white text-[10px] focus:outline-none focus:border-[#22c55e]/50"
                              style={{ colorScheme: "dark" }}
                            >
                              {SOCIAL_PLATFORMS.map((p) => (
                                <option key={p.value} value={p.value} className="bg-[#1e293b] text-white">
                                  {p.label}
                                </option>
                              ))}
                            </select>
                            <input
                              value={(s && s.url) || ""}
                              onChange={(e) => {
                                const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                                items[si] = { ...items[si], url: e.target.value };
                                handleItemChange("members", i, "socials", items);
                              }}
                              className="flex-[0.6] px-1.5 py-1 rounded bg-white/5 border border-white/10 text-white text-[10px]"
                              placeholder="https://..."
                            />
                            <button onClick={() => {
                              const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                              items.splice(si, 1);
                              handleItemChange("members", i, "socials", items);
                            }} className="text-red-400 hover:text-red-300 text-[10px] px-1">&times;</button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const items = [...(Array.isArray(member.socials) ? member.socials : []), { platform: "instagram", url: "#" }];
                            handleItemChange("members", i, "socials", items);
                          }}
                          className="w-full py-0.5 text-[10px] text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded hover:bg-[#22c55e]/10 transition-colors mt-0.5"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("members", { name: "Anggota Baru", role: "Jabatan", image: "https://placehold.co/200x200/1e293b/64748b?text=Team", socials: [{ platform: "instagram", url: "#" }] })}`;

if (content.includes(oldPart)) {
  content = content.replace(oldPart, newPart);
  fs.writeFileSync(p, content, "utf8");
  console.log("✅ Team member socials replaced successfully");
} else {
  console.log("❌ Old team member socials pattern not found!");
  // Debug
  const idx = content.indexOf("Instagram URL");
  if (idx >= 0) {
    console.log("Found 'Instagram URL' at", idx);
    console.log("Context:", content.substring(Math.max(0, idx - 50), idx + 150));
  }
}
