import * as React from "react";

/**
 * Product specification list — S2.4 §10.3 ("specification" section).
 * Renders only fields the public contract actually carries (`unit`,
 * `originCountry`, `manufacturer`, `distributor` — `public-data-contract`);
 * never fabricated, never `sku`/`barcode`/cost. Omits the whole section (not
 * an empty box) when nothing is present.
 */
export interface ProductSpecListProps {
  unit?: string | null;
  originCountry?: string | null;
  manufacturer?: string | null;
  distributor?: string | null;
}

function ProductSpecList({ unit, originCountry, manufacturer, distributor }: ProductSpecListProps) {
  const rows: Array<{ label: string; value: string }> = [
    unit ? { label: "Đơn vị", value: unit } : null,
    originCountry ? { label: "Xuất xứ", value: originCountry } : null,
    manufacturer ? { label: "Nhà sản xuất", value: manufacturer } : null,
    distributor ? { label: "Nhà phân phối", value: distributor } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-h2 text-text">Thông số sản phẩm</h2>
      <dl className="flex flex-col divide-y divide-border rounded-md border border-border">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-body-sm text-text-muted">{row.label}</dt>
            <dd className="text-body-sm text-right text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export { ProductSpecList };
