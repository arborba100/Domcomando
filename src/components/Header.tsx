import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { useDirtyMoneyStore } from "@/store/dirtyMoneyStore";
import { useCleanMoneyStore } from "@/store/cleanMoneyStore";
import { usePlayerStore } from "@/store/playerStore";
import { useSpinVault } from "@/hooks/useSpinVault";
import { useNavigate } from "react-router-dom";
import { usePlayerInitialization } from "@/hooks/usePlayerInitialization";
import { useMember } from "@/integrations";
import { Droplet, Shield, Zap, Coins, Gem, Crown, Flame } from "lucide-react";

const LOGO_SRC =
  "https://static.wixstatic.com/media/50f4bf_01590cb08b7048babbfed83e2830a27c~mv2.png";

export default function Header() {
  const { dirtyMoney } = useDirtyMoneyStore();
  const { cleanMoney } = useCleanMoneyStore();
  const { playerName, setPlayerName, level } = usePlayerStore();
  const { spins, timeUntilNextGain, formatTime } = useSpinVault();
  const navigate = useNavigate();
  const { member } = useMember();

  usePlayerInitialization();

  const [avatarUrl, setAvatarUrl] = useState(
    "https://static.wixstatic.com/media/50f4bf_a888df3d639f415b853110e459edba8c~mv2.png"
  );

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    const savedAvatar = localStorage.getItem("playerAvatar");

    if (savedName) setPlayerName(savedName);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, [setPlayerName]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 md:px-4 pt-2">
      <div
        className="mx-auto max-w-[1680px] overflow-hidden rounded-[28px] border shadow-[0_0_50px_rgba(0,0,0,0.55)]"
        style={{
          borderColor: "rgba(212,175,55,0.35)",
          background:
            "linear-gradient(90deg, rgba(8,5,5,0.98) 0%, rgba(32,10,10,0.98) 28%, rgba(20,8,8,0.98) 60%, rgba(8,5,5,0.98) 100%)",
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,180,0,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,0,0,0.08),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

          <div className="relative px-3 md:px-5 py-3 md:py-4">
            <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4">
              {/* LOGO */}
              <div className="flex items-center justify-center 2xl:justify-start min-w-[220px]">
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-yellow-500/20" />
                  <Image
                    src={LOGO_SRC}
                    alt="Logo"
                    width={230}
                    height={92}
                    className="relative object-contain drop-shadow-[0_0_22px_rgba(255,200,0,0.22)]"
                  />
                </div>
              </div>

              {/* BLOCO CENTRAL */}
              <div className="flex-1">
                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl px-3 md:px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_30px_rgba(0,0,0,0.2)]">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* IDENTIDADE */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full blur-2xl bg-yellow-400/35" />
                        <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-red-500 opacity-80" />
                        <div className="relative w-[82px] h-[82px] rounded-full overflow-hidden border-[3px] border-black/60 shadow-[0_0_30px_rgba(255,200,0,0.35)]">
                          <Image
                            src={avatarUrl}
                            className="w-full h-full object-cover"
                            alt="Avatar do jogador"
                          />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-yellow-300 shrink-0" />
                          <div className="text-yellow-300 font-black text-xl md:text-2xl truncate tracking-wide drop-shadow-[0_0_10px_rgba(255,200,0,0.18)]">
                            {playerName || "Jogador"}
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-[10px] md:text-xs px-3 py-1 font-black uppercase tracking-[0.18em] shadow-[0_0_18px_rgba(255,0,0,0.18)]">
                            <Shield className="w-3.5 h-3.5" />
                            COMANDANTE DE ELITE
                          </div>

                          <div className="inline-flex items-center gap-1 rounded-md border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 text-[10px] md:text-xs px-2 py-1 font-bold uppercase tracking-[0.14em]">
                            <Flame className="w-3.5 h-3.5" />
                            OSTENTAÇÃO ATIVA
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATS */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                      <StatCard
                        icon={<Zap className="w-4 h-4" />}
                        label="Nível"
                        value={String(level)}
                        tone="yellow"
                      />
                      <StatCard
                        icon={<Shield className="w-4 h-4" />}
                        label="Poder"
                        value="1.2M"
                        tone="red"
                      />
                      <StatCard
                        icon={<Coins className="w-4 h-4" />}
                        label="Dinheiro Sujo"
                        value={formatMoney(dirtyMoney)}
                        tone="green"
                      />
                      <StatCard
                        icon={<Coins className="w-4 h-4" />}
                        label="Dinheiro Limpo"
                        value={formatMoney(cleanMoney)}
                        tone="cyan"
                      />
                      <StatCard
                        icon={<Gem className="w-4 h-4" />}
                        label="Giros"
                        value={String(spins)}
                        tone="purple"
                      />
                    </div>

                    {/* BOTÃO */}
                    {member?._id && (
                      <div className="shrink-0">
                        <button
                          onClick={() => navigate("/money-laundering")}
                          className="w-full xl:w-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-white font-black tracking-[0.08em] border border-cyan-300/20 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 hover:from-cyan-500 hover:via-sky-500 hover:to-blue-600 shadow-[0_0_24px_rgba(0,180,255,0.25)] transition-all"
                          title="Operações de Lavagem"
                        >
                          <Droplet className="w-4 h-4" />
                          LAVAGEM
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TIMER */}
              <div className="min-w-[250px]">
                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(255,255,255,0.02))] px-4 py-4 backdrop-blur-xl text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-slate-300">
                    Próximo ganho de giros
                  </div>

                  <div className="flex gap-2 justify-center mt-3">
                    {formatTimer(formatTime(timeUntilNextGain)).map((t, i) => (
                      <div
                        key={i}
                        className="min-w-[62px] rounded-xl px-3 py-3 text-xl font-black text-white border shadow-[0_0_18px_rgba(0,0,0,0.28)]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(5,5,5,0.95) 0%, rgba(20,20,20,0.95) 100%)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] mt-2 text-slate-400">
                    Tempo até próximo giro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      </div>
    </header>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "yellow" | "red" | "green" | "cyan" | "purple";
}) {
  const toneClasses = {
    yellow: {
      label: "text-yellow-300",
      glow: "shadow-[0_0_18px_rgba(255,200,0,0.08)]",
    },
    red: {
      label: "text-red-300",
      glow: "shadow-[0_0_18px_rgba(255,0,0,0.08)]",
    },
    green: {
      label: "text-green-300",
      glow: "shadow-[0_0_18px_rgba(0,255,120,0.08)]",
    },
    cyan: {
      label: "text-cyan-300",
      glow: "shadow-[0_0_18px_rgba(0,200,255,0.08)]",
    },
    purple: {
      label: "text-fuchsia-300",
      glow: "shadow-[0_0_18px_rgba(180,0,255,0.08)]",
    },
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-center ${toneClasses[tone].glow} shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
    >
      <div className={`flex items-center justify-center gap-1 text-[11px] uppercase tracking-[0.14em] ${toneClasses[tone].label}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-white font-black text-lg tracking-wide">
        {value}
      </div>
    </div>
  );
}

function formatMoney(v: number) {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return String(v);
}

function formatTimer(t: string) {
  const parts = t.split(":");
  return parts.length === 2 ? parts : ["45", "00"];
}