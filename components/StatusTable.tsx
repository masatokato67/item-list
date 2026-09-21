import { StatusTable as StatusTableData } from "@/lib/types";

const toneStyles: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800",
  soon: "bg-amber-100 text-amber-800",
  pending: "bg-gray-200 text-gray-600",
};

export default function StatusTable({ data }: { data: StatusTableData }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold text-gray-900">{data.heading}</h2>
      {data.intro && (
        <p className="mb-4 text-sm leading-relaxed text-gray-600">{data.intro}</p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-emerald-600 text-white">
              {data.columns.map((c, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-3 py-2.5 text-left font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={i}
                className={`border-t border-gray-100 ${
                  row.highlight
                    ? "bg-amber-50"
                    : i % 2
                    ? "bg-gray-50/60"
                    : "bg-white"
                }`}
              >
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2.5 align-middle text-gray-700 ${
                      j === 0
                        ? "whitespace-nowrap font-semibold text-gray-900"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
                {row.status && (
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
                        toneStyles[row.status.tone]
                      }`}
                    >
                      {row.status.label}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.updatedLabel && (
        <p className="mt-2 text-xs text-gray-400">{data.updatedLabel}</p>
      )}
      {data.note && (
        <p className="mt-2 text-xs leading-relaxed text-gray-500">{data.note}</p>
      )}
    </section>
  );
}
