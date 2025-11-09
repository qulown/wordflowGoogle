
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const downloadTextFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  triggerDownload(blob, filename);
};

export const downloadMarkdownFile = (content: string, filename:string): void => {
  const blob = new Blob([content], { type: 'text/markdown' });
  triggerDownload(blob, filename);
};
