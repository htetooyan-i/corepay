export type StatementTransaction = {
  id: string;
  amount: number;
  transactionType: string;
  transactionStatus: string;
  createdAt: string;
  counterparty: string;
  direction: "incoming" | "outgoing";
};

type StatementDetails = {
  accountId: string;
  accountHolder: string;
  transactions: StatementTransaction[];
};

export function downloadTransactionPdf(
  transaction: StatementTransaction,
  accountId: string,
  accountHolder: string,
) {
  downloadPdf(
    buildReceiptPdf(transaction, accountId, accountHolder),
    `paycore-transaction-${transaction.id.slice(0, 8)}.pdf`,
  );
}

export function downloadStatementPdf({
  accountId,
  accountHolder,
  transactions,
}: StatementDetails) {
  downloadPdf(
    buildStatementPdf(accountId, accountHolder, transactions),
    "paycore-account-statement.pdf",
  );
}

function downloadPdf(content: string, fileName: string) {
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildReceiptPdf(
  transaction: StatementTransaction,
  accountId: string,
  accountHolder: string,
) {
  const content = [
    headerCommands("Transaction receipt"),
    text("Transaction receipt", 50, 670, 22, "bold", [15, 23, 42]),
    text(`Issued ${formatDate(new Date().toISOString())}`, 50, 648, 10, "regular", [100, 116, 139]),
    line(50, 625, 562, 625, [226, 232, 240]),
    text("TRANSACTION DETAILS", 50, 598, 10, "bold", [8, 145, 178]),
    detailRow("Transaction ID", transaction.id, 570),
    detailRow("Date", formatDate(transaction.createdAt), 544),
    detailRow("Type", formatType(transaction.transactionType), 518),
    detailRow("Direction", capitalize(transaction.direction), 492),
    detailRow("Counterparty", transaction.counterparty, 466),
    detailRow("Status", capitalize(transaction.transactionStatus.toLowerCase()), 440),
    line(50, 410, 562, 410, [226, 232, 240]),
    text("AMOUNT", 50, 382, 10, "bold", [100, 116, 139]),
    text(
      formatAmount(transaction.amount, transaction.direction),
      50,
      350,
      24,
      "bold",
      transaction.direction === "incoming" ? [5, 150, 105] : [234, 88, 12],
    ),
    text(`Account holder: ${accountHolder}`, 50, 282, 10, "regular", [71, 85, 105]),
    text(`Account ID: ${accountId}`, 50, 264, 10, "regular", [71, 85, 105]),
    footerCommands(),
  ].join("\n");

  return buildPdf([content]);
}

function buildStatementPdf(
  accountId: string,
  accountHolder: string,
  transactions: StatementTransaction[],
) {
  const pages: string[] = [];
  const pageSize = 24;
  const pageCount = Math.max(1, Math.ceil(transactions.length / pageSize));

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageTransactions = transactions.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize,
    );
    const content = [
      headerCommands("Account statement"),
      text("Account statement", 50, 688, 22, "bold", [15, 23, 42]),
      text(accountHolder, 50, 662, 11, "regular", [71, 85, 105]),
      text(`Account ID: ${accountId}`, 50, 644, 10, "regular", [100, 116, 139]),
      text(`Generated ${formatDate(new Date().toISOString())}`, 390, 644, 10, "regular", [100, 116, 139]),
      line(50, 620, 562, 620, [226, 232, 240]),
      tableHeaderCommands(594),
      ...pageTransactions.flatMap((transaction, index) =>
        tableRowCommands(transaction, 566 - index * 20),
      ),
      footerCommands(pageIndex + 1, pageCount),
    ].join("\n");

    pages.push(content);
  }

  return buildPdf(pages);
}

function buildPdf(pageContents: string[]) {
  const pageObjectStart = 3;
  const regularFontObject = pageObjectStart + pageContents.length;
  const boldFontObject = regularFontObject + 1;
  const contentObjectStart = boldFontObject + 1;
  const pageObjects = pageContents.map(
    (_, index) =>
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${regularFontObject} 0 R /F2 ${boldFontObject} 0 R >> >> /Contents ${contentObjectStart + index} 0 R >>`,
  );
  const contentObjects = pageContents.map(
    (content) => `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  );
  const pageReferences = pageContents
    .map((_, index) => `${pageObjectStart + index} 0 R`)
    .join(" ");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageReferences}] /Count ${pageContents.length} >>`,
    ...pageObjects,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    ...contentObjects,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join("\n");
  pdf += `\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function headerCommands(subtitle: string) {
  return [
    "0.03 0.57 0.70 rg",
    "0 720 612 72 re f",
    text("PayCore", 50, 752, 24, "bold", [255, 255, 255]),
    text(subtitle, 50, 734, 10, "regular", [207, 250, 254]),
  ].join("\n");
}

function tableHeaderCommands(y: number) {
  return [
    "0.95 0.97 0.98 rg",
    `50 ${y - 8} 512 24 re f`,
    text("DATE", 58, y, 9, "bold", [71, 85, 105]),
    text("TYPE / COUNTERPARTY", 155, y, 9, "bold", [71, 85, 105]),
    text("STATUS", 390, y, 9, "bold", [71, 85, 105]),
    text("AMOUNT", 490, y, 9, "bold", [71, 85, 105]),
  ].join("\n");
}

function tableRowCommands(transaction: StatementTransaction, y: number) {
  const amountColor = transaction.direction === "incoming" ? [5, 150, 105] : [234, 88, 12];

  return [
    text(formatDate(transaction.createdAt), 58, y, 9, "regular", [51, 65, 85]),
    text(`${formatType(transaction.transactionType)} / ${truncate(transaction.counterparty, 28)}`, 155, y, 9, "regular", [51, 65, 85]),
    text(capitalize(transaction.transactionStatus.toLowerCase()), 390, y, 9, "regular", [71, 85, 105]),
    text(formatAmount(transaction.amount, transaction.direction), 490, y, 9, "bold", amountColor),
    line(50, y - 8, 562, y - 8, [226, 232, 240]),
  ];
}

function detailRow(label: string, value: string, y: number) {
  return [
    text(label, 50, y, 10, "regular", [100, 116, 139]),
    text(truncate(value, 68), 190, y, 10, "bold", [15, 23, 42]),
  ].join("\n");
}

function footerCommands(page = 1, pageCount = 1) {
  return [
    line(50, 56, 562, 56, [226, 232, 240]),
    text("PayCore | Secure financial workspace", 50, 38, 9, "regular", [100, 116, 139]),
    text(`Page ${page} of ${pageCount}`, 500, 38, 9, "regular", [100, 116, 139]),
  ].join("\n");
}

function text(
  value: string,
  x: number,
  y: number,
  size: number,
  font: "regular" | "bold",
  color: number[],
) {
  return `${color.map((channel) => (channel / 255).toFixed(3)).join(" ")} rg\nBT\n/F${font === "bold" ? 2 : 1} ${size} Tf\n${x} ${y} Td\n(${escapePdfText(value)}) Tj\nET`;
}

function line(x1: number, y1: number, x2: number, y2: number, color: number[]) {
  return `${color.map((channel) => (channel / 255).toFixed(3)).join(" ")} RG\n${x1} ${y1} m\n${x2} ${y2} l\nS`;
}

function escapePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

function formatType(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatAmount(value: number, direction: "incoming" | "outgoing") {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

  return `${direction === "incoming" ? "+" : "-"}${amount}`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
