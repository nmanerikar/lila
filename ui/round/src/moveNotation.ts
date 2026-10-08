import { key2pos } from '@lichess-org/chessground/util';

import type { ApiMove } from './interfaces';

// Briefly shows the notation of a move (e.g. e4, Nxf3+, O-O) on its destination square, to help
// players learn chess notation. The label fades out by itself, see `move-notation` in _round.scss.
export function showMoveNotation(cg: CgApi, move: ApiMove): void {
  const container = cg.state.dom.elements.container;
  container.querySelectorAll('move-notation').forEach(el => el.remove());

  // Castling is sent king-to-rook: show the label on the king's destination instead.
  const dest = move.castle?.king[1] ?? (move.uci.slice(2, 4) as Key);
  const [file, rank] = key2pos(dest);
  const asWhite = cg.state.orientation === 'white';
  const col = asWhite ? file : 7 - file;
  const row = asWhite ? 7 - rank : rank;

  const el = document.createElement('move-notation');
  el.textContent = move.san;
  // Center the label on the square, but keep long notations on the edge files within the board.
  if (col === 0) el.style.left = '0';
  else if (col === 7) el.style.right = '0';
  else {
    el.style.left = `${(col + 0.5) * 12.5}%`;
    el.style.setProperty('--tx', '-50%');
  }
  el.style.top = `${(row + 0.5) * 12.5}%`;
  el.addEventListener('animationend', () => el.remove());
  container.appendChild(el);
}
