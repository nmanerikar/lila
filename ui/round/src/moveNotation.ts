import { key2pos } from '@lichess-org/chessground/util';

import type { ApiMove } from './interfaces';

// Briefly shows the notation of a move (e.g. e4, Nxf3+, O-O) above its destination square, to help
// players learn chess notation. The label fades out by itself, see `move-notation` in _round.scss.
export function showMoveNotation(cg: CgApi, move: ApiMove): void {
  const container = cg.state.dom.elements.container;
  container.querySelectorAll('move-notation').forEach(el => el.remove());

  // Castling is sent king-to-rook: anchor the label on the king's destination instead.
  const dest = move.castle?.king[1] ?? (move.uci.slice(2, 4) as Key);
  const [file, rank] = key2pos(dest);
  const asWhite = cg.state.orientation === 'white';
  const col = asWhite ? file : 7 - file;
  const row = asWhite ? 7 - rank : rank;

  const el = document.createElement('move-notation');
  el.textContent = move.san;
  // Center the label on the top edge of the square, but keep it within the board.
  if (col === 0) el.style.left = '0';
  else if (col === 7) el.style.right = '0';
  else {
    el.style.left = `${(col + 0.5) * 12.5}%`;
    el.style.setProperty('--tx', '-50%');
  }
  if (row === 0) el.style.top = '0';
  else {
    el.style.top = `${row * 12.5}%`;
    el.style.setProperty('--ty', '-50%');
  }
  el.addEventListener('animationend', () => el.remove());
  container.appendChild(el);
}
