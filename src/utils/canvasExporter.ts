import {
  PreviewAssetTab,
  THEME_CONFIGS,
  ThemeId,
  WeddingData,
  getCoupleMonogram,
  getDaysUntilWedding,
} from '../types/wedding';

export interface ExportOptions {
  data: WeddingData;
  themeId: ThemeId;
  assetTab: PreviewAssetTab;
  includeWatermark: boolean;
  bleedPx?: number;
  drawCropMarks?: boolean;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('無法載入婚紗照影像'));
    img.src = src;
  });
}

function drawCroppedPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number,
  posX: number,
  posY: number,
  shape: 'rect' | 'rounded' | 'arch' = 'rect'
) {
  ctx.save();
  ctx.beginPath();
  if (shape === 'arch') {
    const r = w / 2;
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, 0, false);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  } else if (shape === 'rounded') {
    ctx.roundRect(x, y, w, h, 18);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;

  if (imgRatio > boxRatio) {
    drawH = h * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = w * scale;
    drawH = drawW / imgRatio;
  }

  const overflowX = Math.max(0, drawW - w);
  const overflowY = Math.max(0, drawH - h);
  const offsetX = x - overflowX * (posX / 100);
  const offsetY = y - overflowY * (posY / 100);

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const chars = Array.from(text);
  const lines: string[] = [];
  let current = '';

  for (const ch of chars) {
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawWaxSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  monogram: string
) {
  ctx.save();
  const grad = ctx.createRadialGradient(
    cx - radius * 0.3,
    cy - radius * 0.3,
    radius * 0.1,
    cx,
    cy,
    radius
  );
  grad.addColorStop(0, '#DAC59C');
  grad.addColorStop(0.65, '#C5AA7C');
  grad.addColorStop(1, '#A48759');

  ctx.shadowColor = 'rgba(101, 80, 71, 0.25)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(251, 248, 244, 0.48)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FBF8F4';
  ctx.font = `600 ${Math.round(radius * 0.56)}px "Cormorant Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(monogram, cx, cy + 2);
  ctx.restore();
}

function drawFrameBorders(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  themeId: ThemeId,
  borderColor: string,
  accentColor: string
) {
  ctx.save();
  ctx.translate(offsetX, offsetY);
  if (themeId === 'royal-rose') {
    const pad = 30;
    const innerPad = 44;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2);

    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.8;
    const cornerOffsets: [number, number][] = [
      [pad + 24, pad + 24],
      [width - pad - 24, pad + 24],
      [pad + 24, height - pad - 24],
      [width - pad - 24, height - pad - 24],
    ];
    for (const [cx, cy] of cornerOffsets) {
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(209, 173, 162, 0.25)';
      ctx.fill();
    }
  } else if (themeId === 'modern-oriental') {
    const pad = 28;
    const innerPad = 42;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2);

    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    const c = 36;
    const corners: [number, number, number, number][] = [
      [pad, pad, 1, 1],
      [width - pad, pad, -1, 1],
      [pad, height - pad, 1, -1],
      [width - pad, height - pad, -1, -1],
    ];
    for (const [cx, cy, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * 12, cy + sy * c);
      ctx.lineTo(cx + sx * 12, cy + sy * 12);
      ctx.lineTo(cx + sx * c, cy + sy * 12);
      ctx.stroke();
    }
  } else if (themeId === 'french-manor') {
    const pad = 32;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  } else {
    const pad = 38;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  }
  ctx.restore();
}

function drawBleedCropMarks(
  ctx: CanvasRenderingContext2D,
  totalW: number,
  totalH: number,
  bleed: number
) {
  if (bleed <= 0) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(101, 80, 71, 0.45)';
  ctx.lineWidth = 1.2;
  const markLen = Math.max(10, Math.min(20, bleed - 4));
  const corners: [number, number, number, number][] = [
    [bleed, bleed, -1, -1],
    [totalW - bleed, bleed, 1, -1],
    [bleed, totalH - bleed, -1, 1],
    [totalW - bleed, totalH - bleed, 1, 1],
  ];
  for (const [x, y, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x + dx * 3, y);
    ctx.lineTo(x + dx * (3 + markLen), y);
    ctx.moveTo(x, y + dy * 3);
    ctx.lineTo(x, y + dy * (3 + markLen));
    ctx.stroke();
  }
  ctx.restore();
}

export async function renderWeddingAssetCanvas({
  data,
  themeId,
  assetTab,
  includeWatermark,
  bleedPx = 0,
  drawCropMarks = false,
}: ExportOptions): Promise<HTMLCanvasElement> {
  const theme = THEME_CONFIGS[themeId];
  const daysLeft = getDaysUntilWedding(data.weddingDateIso);
  const monogram = getCoupleMonogram(data.coupleNamesEn);

  let width = 1080;
  let height = 1920;
  if (assetTab === 'welcome-poster') {
    width = 1188;
    height = 1682; // A1 ratio
  } else if (assetTab === 'table-card') {
    width = 1080;
    height = 1440; // 3:4 luxury banquet table card
  } else if (assetTab === 'line-traffic') {
    width = 1080;
    height = 1350; // 4:5 ideal for LINE guest sharing
  }

  const totalW = width + bleedPx * 2;
  const totalH = height + bleedPx * 2;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('無法建立輸出畫布');

  // Extend full paper background across bleed zone
  ctx.fillStyle = theme.colors.canvasBg;
  ctx.fillRect(0, 0, totalW, totalH);

  drawFrameBorders(
    ctx,
    bleedPx,
    bleedPx,
    width,
    height,
    themeId,
    theme.colors.border,
    theme.colors.primaryAccent
  );

  let img: HTMLImageElement | null = null;
  try {
    img = await loadImage(data.photoUrl);
  } catch {
    img = null;
  }

  ctx.save();
  ctx.translate(bleedPx, bleedPx);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const photoShape: 'rect' | 'rounded' | 'arch' =
    themeId === 'royal-rose' || themeId === 'french-manor'
      ? 'arch'
      : themeId === 'korean-minimalist'
      ? 'rounded'
      : 'rect';

  if (assetTab === 'e-invite') {
    ctx.fillStyle =
      themeId === 'royal-rose' ? theme.colors.foilAccent : theme.colors.primaryAccent;
    ctx.font =
      themeId === 'royal-rose' || themeId === 'french-manor'
        ? `400 64px ${theme.typography.canvasScriptFont}`
        : `500 28px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(theme.typography.scriptOrSealLabel, width / 2, 138);

    ctx.fillStyle = theme.colors.inkMuted;
    ctx.font = `400 24px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(`${data.weddingDateIso} · 距離大喜之日還有 ${daysLeft} 天`, width / 2, 202);

    const photoW = 720;
    const photoH = 880;
    const photoX = (width - photoW) / 2;
    const photoY = 264;

    if (img) {
      drawCroppedPhoto(
        ctx,
        img,
        photoX,
        photoY,
        photoW,
        photoH,
        data.photoScale,
        data.photoPosX,
        data.photoPosY,
        photoShape
      );
      ctx.save();
      ctx.strokeStyle = theme.colors.border;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (photoShape === 'arch') {
        const r = photoW / 2;
        ctx.moveTo(photoX, photoY + photoH);
        ctx.lineTo(photoX, photoY + r);
        ctx.arc(photoX + r, photoY + r, r, Math.PI, 0, false);
        ctx.lineTo(photoX + photoW, photoY + photoH);
        ctx.closePath();
      } else if (photoShape === 'rounded') {
        ctx.roundRect(photoX, photoY, photoW, photoH, 18);
      } else {
        ctx.rect(photoX, photoY, photoW, photoH);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (themeId === 'royal-rose') {
      drawWaxSeal(ctx, width / 2, photoY + photoH, 42, monogram);
    }

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 62px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesZh || '陳宥廷 & 林語希', width / 2, 1264);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `italic 400 42px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesEn || 'Ethan & Chloe', width / 2, 1336);

    ctx.strokeStyle = theme.colors.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 1402);
    ctx.lineTo(width / 2 + 140, 1402);
    ctx.stroke();

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `500 30px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.dateTimeLabel, width / 2, 1472);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `500 30px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.venueName, width / 2, 1536);

    ctx.fillStyle = theme.colors.inkMuted;
    ctx.font = `400 24px ${theme.typography.canvasBodyFont}`;
    const noteLines = wrapText(ctx, `${data.venueAddress} · ${data.trafficNote}`, 820);
    noteLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, width / 2, 1602 + idx * 38);
    });

    if (!drawCropMarks) {
      ctx.fillStyle = theme.colors.primaryAccent;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 230, 1708, 460, 68, 12);
      ctx.fill();
      ctx.fillStyle = theme.colors.primaryAccentText;
      ctx.font = `500 26px ${theme.typography.canvasBodyFont}`;
      ctx.fillText('查看會館導航與出席回覆', width / 2, 1742);
    }
  } else if (assetTab === 'welcome-poster') {
    ctx.fillStyle =
      themeId === 'royal-rose' ? theme.colors.foilAccent : theme.colors.primaryAccent;
    ctx.font =
      themeId === 'royal-rose' || themeId === 'french-manor'
        ? `400 58px ${theme.typography.canvasScriptFont}`
        : `500 28px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(theme.typography.welcomeSubtitle, width / 2, 132);

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 44px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText('誠摯歡迎蒞臨我們的大喜之日', width / 2, 202);

    const photoW = 840;
    const photoH = 880;
    const photoX = (width - photoW) / 2;
    const photoY = 272;
    if (img) {
      drawCroppedPhoto(
        ctx,
        img,
        photoX,
        photoY,
        photoW,
        photoH,
        data.photoScale,
        data.photoPosX,
        data.photoPosY,
        photoShape
      );
    }

    if (themeId === 'royal-rose') {
      drawWaxSeal(ctx, width / 2, photoY + photoH, 44, monogram);
    }

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 68px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesZh || '陳宥廷 & 林語希', width / 2, 1272);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `italic 400 44px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesEn || 'Ethan & Chloe', width / 2, 1348);

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `500 30px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.dateTimeLabel, width / 2, 1438);

    ctx.fillStyle = theme.colors.primaryAccent;
    ctx.font = `600 32px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.venueName, width / 2, 1502);
  } else if (assetTab === 'table-card') {
    ctx.fillStyle = theme.colors.foilAccent;
    ctx.font = `500 26px ${theme.typography.canvasBodyFont}`;
    ctx.fillText('BANQUET TABLE CARD · 婚宴賓客桌卡', width / 2, 132);

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 64px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.tableLabel || '摯友席 · Table 06', width / 2, 224);

    if (themeId === 'royal-rose') {
      drawWaxSeal(ctx, width / 2, 326, 40, monogram);
    }

    const photoW = 460;
    const photoH = 520;
    const photoX = (width - photoW) / 2;
    const photoY = themeId === 'royal-rose' ? 404 : 320;
    if (img) {
      drawCroppedPhoto(
        ctx,
        img,
        photoX,
        photoY,
        photoW,
        photoH,
        data.photoScale,
        data.photoPosX,
        data.photoPosY,
        photoShape
      );
    }

    const textBaseY = photoY + photoH + 74;
    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 46px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesZh || '陳宥廷 & 林語希', width / 2, textBaseY);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `italic 400 32px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesEn || 'Ethan & Chloe', width / 2, textBaseY + 54);

    ctx.fillStyle = theme.colors.inkMuted;
    ctx.font = `400 25px ${theme.typography.canvasBodyFont}`;
    const quoteLines = wrapText(ctx, data.welcomeQuote, 780);
    quoteLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, width / 2, textBaseY + 124 + idx * 38);
    });

    ctx.fillStyle = theme.colors.primaryAccent;
    ctx.font = `500 24px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.timelineNote, width / 2, height - 150);
  } else {
    ctx.fillStyle = theme.colors.primaryAccent;
    ctx.font = `500 28px ${theme.typography.canvasBodyFont}`;
    ctx.fillText('LINE 賓客交通與婚宴提醒', width / 2, 126);

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 54px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesZh || '陳宥廷 & 林語希', width / 2, 206);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `italic 400 34px ${theme.typography.canvasDisplayFont}`;
    ctx.fillText(data.coupleNamesEn || 'Ethan & Chloe', width / 2, 264);

    const photoW = 360;
    const photoH = 360;
    const photoX = (width - photoW) / 2;
    const photoY = 324;
    if (img) {
      drawCroppedPhoto(
        ctx,
        img,
        photoX,
        photoY,
        photoW,
        photoH,
        data.photoScale,
        data.photoPosX,
        data.photoPosY,
        'rounded'
      );
    }

    ctx.fillStyle = theme.colors.surfaceBg;
    ctx.beginPath();
    ctx.roundRect(96, 738, width - 192, 446, 18);
    ctx.fill();
    ctx.strokeStyle = theme.colors.secondaryBorder;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 30px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.dateTimeLabel, width / 2, 810);

    ctx.fillStyle = theme.colors.primaryAccent;
    ctx.font = `500 26px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.timelineNote, width / 2, 874);

    ctx.fillStyle = theme.colors.inkPrimary;
    ctx.font = `600 30px ${theme.typography.canvasBodyFont}`;
    ctx.fillText(data.venueName, width / 2, 954);

    ctx.fillStyle = theme.colors.inkSecondary;
    ctx.font = `400 25px ${theme.typography.canvasBodyFont}`;
    const addrLines = wrapText(ctx, `${data.venueAddress} · ${data.trafficNote}`, 780);
    addrLines.slice(0, 3).forEach((line, idx) => {
      ctx.fillText(line, width / 2, 1020 + idx * 42);
    });
  }

  if (includeWatermark) {
    ctx.fillStyle = theme.colors.inkMuted;
    ctx.font = `400 22px "Plus Jakarta Sans", "Noto Sans TC", sans-serif`;
    ctx.fillText('Designed with LifeTale WeddingSuite', width / 2, height - 68);
  }

  ctx.restore();

  if (drawCropMarks && bleedPx > 0) {
    drawBleedCropMarks(ctx, totalW, totalH, bleedPx);
  }

  return canvas;
}

export async function exportWeddingAsset(options: ExportOptions): Promise<string> {
  const canvas = await renderWeddingAssetCanvas(options);
  const dataUrl = canvas.toDataURL('image/png', 0.95);
  const link = document.createElement('a');
  const suffix = options.includeWatermark ? 'preview' : 'hires';
  link.download = `LifeTale-${options.themeId}-${options.assetTab}-${suffix}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return link.download;
}
