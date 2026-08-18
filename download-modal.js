const downloadModal = document.querySelector('#download-modal');
const closeDownloadModal = () => { downloadModal.hidden = true; };

document.querySelector('#asset-grid').addEventListener('click', event => {
  const downloadButton = event.target.closest('.download');
  if (!downloadButton) return;

  event.preventDefault();
  const link = document.createElement('a');
  link.href = downloadButton.href;
  link.download = downloadButton.getAttribute('download') || 'wise-asset.png';
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => { downloadModal.hidden = false; }, 150);
});

document.querySelector('#modal-close').addEventListener('click', closeDownloadModal);
downloadModal.addEventListener('click', event => { if (event.target === downloadModal) closeDownloadModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDownloadModal(); });
