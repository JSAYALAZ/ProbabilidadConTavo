import React, { useMemo, useState } from "react";
import { Espacio, ProbabilitySummary } from "../../domain/models/Espacio";
import { Evento } from "../../domain/models/Evento";

// ===== Helpers UI =====

function percent(x: number | null | undefined, digits = 2) {
  if (x == null || Number.isNaN(x)) return "–";
  return `${(x * 100).toFixed(digits)}%`;
}

function StatCard({
  title,
  value,
  subtitle,
  accent = "#3AAFA9",
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl border shadow-sm p-4 bg-white/90 backdrop-blur-sm"
      style={{ borderColor: accent }}
    >
      <div className="text-xs uppercase tracking-wide text-[#2B7A78] opacity-80">
        {title}
      </div>
      <div className="text-2xl font-bold text-[#17252A] mt-1">{value}</div>
      {subtitle ? (
        <div className="text-sm text-[#2B7A78] mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}

function Badge({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    info: "bg-[#DEF2F1] text-[#2B7A78] border-[#3AAFA9]",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    danger: "bg-rose-100 text-rose-800 border-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2 py-0.5 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

// ===== Componente principal =====

export default function ViewSpave({
  espacio,
  selectEvnt,
}: {
  espacio: Espacio;
  selectEvnt: (evnt: Evento) => void;
}) {
  const resumen = useMemo<ProbabilitySummary>(
    () => espacio.getProbabilitySummary({ precision: 4 }) as ProbabilitySummary,
    [espacio]
  );

  // Grupos de muestras (usando la API actual del dominio)
  const grupos = useMemo(() => Array.from(espacio.getGroups()), [espacio]);

  const [showEmptyPartitions, setShowEmptyPartitions] = useState(false);
  const nonEmptyPartitions = useMemo(
    () => resumen.partitions.filter((p) => p.count > 0),
    [resumen.partitions]
  );
  const partitionsToShow = showEmptyPartitions
    ? resumen.partitions
    : nonEmptyPartitions;

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* === Columna izquierda: Eventos === */}
      <aside className="bg-[#0B0C10]/5 rounded-2xl border border-[#3AAFA9]/40 p-4 h-[calc(100vh-33vh)] overflow-y-scroll">
        <h2 className="text-xl font-bold text-[#17252A] mb-3">Eventos</h2>
        <div className="space-y-3">
          {espacio.eventos.map((e) => {
            const evStat = resumen.events.find((x) => x.name === e.nombre);
            return (
              <button
                key={e.nombre}
                onClick={() => selectEvnt(e)}
                className="w-full text-left cursor-pointer bg-[#DEF2F1] border border-[#3AAFA9] rounded-xl p-4 shadow-sm hover:shadow transition-shadow focus:outline-none focus:ring-2 focus:ring-[#3AAFA9]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-[#2B7A78]">
                    {e.nombre}
                  </h3>
                  <Badge tone="info">
                    {evStat ? `${evStat.count}/${resumen.total}` : "0/0"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    title="P(A)"
                    value={percent(evStat?.probability ?? 0)}
                  />
                  <StatCard
                    title="P(Ā)"
                    value={percent(evStat?.complementProbability ?? 0)}
                  />
                </div>
                {e.filtros.length > 0 ? (
                  <ul className="mt-3 text-sm text-[#17252A] list-disc list-inside">
                    {e.filtros.map((f) => (
                      <li key={f.llave} className="truncate">
                        <span className="font-medium">{f.llave}</span>{" "}
                        <span className="opacity-70">{f.comparador}</span>{" "}
                        <span className="opacity-90">{String(f.valor)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[#2B7A78]/80 italic">
                    Sin filtros
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* === Columna central: Muestras (grupos) === */}
      <main className="col-span-3 h-[calc(100vh-33vh)] overflow-y-scroll">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#3AAFA9]/20 py-2 px-1">
          <h2 className="text-xl font-bold text-[#17252A]">Muestras</h2>
          <p className="text-sm text-[#2B7A78]/80">Total: {resumen.total}</p>
        </div>

        <div className="space-y-6 py-4">
          {grupos.map(([grupoKey, muestraRow], rowIndex) => (
            <section key={`${grupoKey}-${rowIndex}`} className="">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-[#2B7A78]">
                  {grupoKey}
                </h3>
                <Badge tone="info">{muestraRow.length} ítems</Badge>
                {resumen.total > 0 && (
                  <Badge tone="success">
                    {percent(muestraRow.length / resumen.total)}
                  </Badge>
                )}
              </div>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {muestraRow.map((muestra, colIndex) => (
                  <article
                    key={colIndex}
                    className="bg-white border border-[#3AAFA9]/60 rounded-xl p-4 shadow-sm hover:shadow transition-shadow"
                  >
                    <ul className="text-sm text-[#17252A] space-y-1">
                      {Array.from(
                        (muestra.values as Map<string, any>).entries()
                      ).map(([key, value]) => (
                        <li
                          key={key}
                          className="flex items-start justify-between gap-3"
                        >
                          <span className="font-medium text-[#2B7A78] whitespace-nowrap">
                            {key}:
                          </span>
                          <span className="text-right break-words max-w-[70%]">
                            {String(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* === Columna derecha: Resumen de probabilidad === */}
      <aside className="bg-white rounded-2xl border border-[#3AAFA9]/40 p-4 h-[calc(100vh-33vh)] overflow-y-scroll">
        <h2 className="text-xl font-bold text-[#17252A] mb-3">
          Resumen de probabilidad
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard title="Tamaño del universo" value={resumen.total} />
          <StatCard
            title="Chequeos"
            value={
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      resumen.sanity.countsSumEqualTotal
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <span className="text-sm">Σ counts = total</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      resumen.sanity.partitionsSumOne
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <span className="text-sm">Σ P(particiones) ≈ 1</span>
                </span>
              </div>
            }
            subtitle={<span className="text-xs opacity-70">Sanity checks</span>}
          />
        </div>

        {/* Eventos: tabla compacta */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#2B7A78] mb-2">
            Marginales P(A)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-[#3AAFA9]/40 rounded-lg overflow-hidden">
              <thead className="bg-[#DEF2F1] text-[#2B7A78]">
                <tr>
                  <th className="px-3 py-2 text-left">Evento</th>
                  <th className="px-3 py-2 text-right">|A|</th>
                  <th className="px-3 py-2 text-right">P(A)</th>
                  <th className="px-3 py-2 text-right">P(Ā)</th>
                </tr>
              </thead>
              <tbody>
                {resumen.events.map((e) => (
                  <tr key={e.name} className="odd:bg-white even:bg-slate-50/60">
                    <td className="px-3 py-2 font-medium text-[#17252A]">
                      {e.name}
                    </td>
                    <td className="px-3 py-2 text-right">{e.count}</td>
                    <td className="px-3 py-2 text-right">
                      {percent(e.probability)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {percent(e.complementProbability)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pares: intersección, unión, condicionales */}
        {/* {resumen.pairwise.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#2B7A78] mb-2">Relaciones por pares</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-[#3AAFA9]/40 rounded-lg overflow-hidden">
                <thead className="bg-[#DEF2F1] text-[#2B7A78]">
                  <tr>
                    <th className="px-3 py-2 text-left">A, B</th>
                    <th className="px-3 py-2 text-right">|A∩B|</th>
                    <th className="px-3 py-2 text-right">P(A∩B)</th>
                    <th className="px-3 py-2 text-right">P(A∪B)</th>
                    <th className="px-3 py-2 text-right">P(A|B)</th>
                    <th className="px-3 py-2 text-right">P(B|A)</th>
                    <th className="px-3 py-2 text-right">Indep.</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.pairwise.map((p, idx) => (
                    <tr key={`${p.a}-${p.b}-${idx}`} className="odd:bg-white even:bg-slate-50/60">
                      <td className="px-3 py-2 font-medium text-[#17252A]">{p.a} ∧ {p.b}</td>
                      <td className="px-3 py-2 text-right">{p.intersectionCount}</td>
                      <td className="px-3 py-2 text-right">{percent(p.intersectionProbability)}</td>
                      <td className="px-3 py-2 text-right">{percent(p.unionProbability)}</td>
                      <td className="px-3 py-2 text-right">{percent(p.condA_given_B ?? null)}</td>
                      <td className="px-3 py-2 text-right">{percent(p.condB_given_A ?? null)}</td>
                      <td className="px-3 py-2 text-right">
                        {p.independence == null ? (
                          <Badge tone="warning">n/a</Badge>
                        ) : p.independence ? (
                          <Badge tone="success">≈ sí</Badge>
                        ) : (
                          <Badge tone="danger">no</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {/* Particiones (todas las celdas del diagrama de Euler) */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[#2B7A78]">
            Particiones (Euler)
          </h3>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-[#3AAFA9] text-[#2B7A78] focus:ring-[#2B7A78]"
              checked={showEmptyPartitions}
              onChange={(e) => setShowEmptyPartitions(e.target.checked)}
            />
            Mostrar vacías
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-[#3AAFA9]/40 rounded-lg overflow-hidden">
            <thead className="bg-[#DEF2F1] text-[#2B7A78]">
              <tr>
                <th className="px-3 py-2 text-left">Celda</th>
                <th className="px-3 py-2 text-right">|·|</th>
                <th className="px-3 py-2 text-right">P(·)</th>
              </tr>
            </thead>
            <tbody>
              {partitionsToShow.map((p) => (
                <tr key={p.mask} className="odd:bg-white even:bg-slate-50/60">
                  <td className="px-3 py-2 font-medium text-[#17252A]">
                    {p.key}
                  </td>
                  <td className="px-3 py-2 text-right">{p.count}</td>
                  <td className="px-3 py-2 text-right">
                    {percent(p.probability)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  );
}
