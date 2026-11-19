"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";

type RibBlockProps = {
  holder: string;
  bankName: string;
  rib: string;
  iban?: string;
  copyLabel: string;
  copiedLabel: string;
};

function CopyRow({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-black/5 py-2 first:border-t-0">
      <div>
        <p className="text-muted text-xs">{label}</p>
        <p className="font-mono">
          <bdi dir="ltr">{value}</bdi>
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          trackEvent("rib_copied", { field: label });
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </Button>
    </div>
  );
}

export function RibBlock({
  holder,
  bankName,
  rib,
  iban,
  copyLabel,
  copiedLabel,
}: RibBlockProps) {
  return (
    <Card>
      <p className="text-muted mb-2 text-sm">{holder}</p>
      <p className="text-muted mb-2 text-sm">{bankName}</p>
      <CopyRow
        label="RIB"
        value={rib}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
      />
      {iban && (
        <CopyRow
          label="IBAN"
          value={iban}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      )}
    </Card>
  );
}
