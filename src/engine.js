// ==========================================/
        // DADOS DO Jogo E REGRAS
        // ==========================================/
        export const RANKS = {
            1: { name: "Rato", icon: "🐭" }, 2: { name: "Gato", icon: "🐱" }, 3: { name: "Cão", icon: "🐶" }, 4: { name: "Lobo", icon: "🐺" },
            5: { name: "Leopardo", icon: "🐆" }, 6: { name: "Tigre", icon: "🐯" }, 7: { name: "Leão", icon: "🦁" }, 8: { name: "Elefante", icon: "🐘" },
            9: { name: "Macaco", icon: "🐒" }
        };

        export const PARTICLE_EMOJIS = {
            1: ['🧀', '🐾', '✨'], 2: ['🐟', '🐾', '✨'], 3: ['🦴', '🐾', '✨'], 4: ['🐺', '🐾', '✨'],
            5: ['🥩', '🐾', '✨'], 6: ['🥩', '🐾', '✨'], 7: ['👑', '🐾', '✨'], 8: ['🥜', '💧', '✨']
        };

        // Removed GOSSIP_TEXTS object, dialogues are now loaded dynamically from I18N YAML files.

        export const TEAMS = {
            0: { color: '#E52222', name: "Vermelho" },
            1: { color: '#25A02B', name: "Verde" },
            2: { color: '#9B59B6', name: "Roxo" }
        };

        export const BOARD_COLS = 7; export const BOARD_ROWS = 9;
        export const WATER_TILES = [
            { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
            { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
            { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
        ];
        export const TRAPS = [
            { x: 2, y: 0, team: 0 }, { x: 4, y: 0, team: 0 }, { x: 3, y: 1, team: 0 },
            { x: 2, y: 8, team: 1 }, { x: 4, y: 8, team: 1 }, { x: 3, y: 7, team: 1 }
        ];
        export const DENS = [{ x: 3, y: 0, team: 0 }, { x: 3, y: 8, team: 1 }];

        export const INITIAL_SETUP = [
            { x: 0, y: 0, t: 0, r: 7 }, { x: 6, y: 0, t: 0, r: 6 }, { x: 1, y: 1, t: 0, r: 3 }, { x: 5, y: 1, t: 0, r: 2 },
            { x: 0, y: 2, t: 0, r: 1 }, { x: 2, y: 2, t: 0, r: 5 }, { x: 4, y: 2, t: 0, r: 4 }, { x: 6, y: 2, t: 0, r: 8 },
            { x: 6, y: 8, t: 1, r: 7 }, { x: 0, y: 8, t: 1, r: 6 }, { x: 5, y: 7, t: 1, r: 3 }, { x: 1, y: 7, t: 1, r: 2 },
            { x: 6, y: 6, t: 1, r: 1 }, { x: 4, y: 6, t: 1, r: 5 }, { x: 2, y: 6, t: 1, r: 4 }, { x: 0, y: 6, t: 1, r: 8 }
        ];

        export class GameEngine {
            constructor() { this.reset(); }
            reset() {
                this.board = Array(BOARD_COLS).fill(null).map(() => Array(BOARD_ROWS).fill(null));
                this.pieces = [];
                this.currentTurn = 1;
                this.winner = null;
                // Easter Egg
                this.secretTileLeftActive = false;
                this.secretTileRightActive = false;
                this.secretPieceLeft = null;
                this.secretPieceRight = null;
                // Easter Egg Phase 2: Banana
                this.bananaLeftActive = false;
                this.bananaRightActive = false;
                this.leftBananaCollected = false;
                this.rightBananaCollected = false;
                this.routeBResolved = false;
                this.easterEggConsumed = false;
                this.bananaTimers = [
                    { active: false, turnsLeft: 0, pending: false, origin: null },
                    { active: false, turnsLeft: 0, pending: false, origin: null }
                ];
                // Macaco-9 State
                this.monkeyActive = false;
                this.monkeyRage = 0;
                this.monkeyPiece = null;
            }
            addPiece(piece) {
                if (piece.gridX === -1 && piece.gridY === 4) this.secretPieceLeft = piece;
                else if (piece.gridX === 7 && piece.gridY === 4) this.secretPieceRight = piece;
                else this.board[piece.gridX][piece.gridY] = piece;
                this.pieces.push(piece);
            }
            getPieceAt(x, y) {
                if (x === -1 && y === 4) return this.secretPieceLeft;
                if (x === 7 && y === 4) return this.secretPieceRight;
                if (x < 0 || x >= BOARD_COLS || y < 0 || y >= BOARD_ROWS) return null;
                return this.board[x][y];
            }
            isWater(x, y) { return WATER_TILES.some(w => w.x === x && w.y === y); }
            isTrap(x, y, team) { return TRAPS.some(t => t.x === x && t.y === y && t.team === team); }
            isDen(x, y, team) { return DENS.some(d => d.x === x && d.y === y && d.team === team); }

            isValidMove(piece, startX, startY, endX, endY) {
                if (this.winner !== null) return false;

                const isLeftSecret = (endX === -1 && endY === 4 && this.secretTileLeftActive);
                const isRightSecret = (endX === 7 && endY === 4 && this.secretTileRightActive);
                if (!isLeftSecret && !isRightSecret) {
                    if (endX < 0 || endX >= BOARD_COLS || endY < 0 || endY >= BOARD_ROWS) return false;
                }
                if (startX === endX && startY === endY) return false;
                if (this.isDen(endX, endY, piece.team)) return false;

                const targetPiece = this.getPieceAt(endX, endY);
                if (targetPiece && targetPiece.team === piece.team) return false;

                const dx = Math.abs(endX - startX), dy = Math.abs(endY - startY);
                const isOrthogonal = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
                const endIsWater = this.isWater(endX, endY), startIsWater = this.isWater(startX, startY);

                if (isOrthogonal) {
                    if (endIsWater && piece.rank !== 1) return false;
                    return this.validateCapture(piece, targetPiece, startIsWater, endIsWater, endX, endY);
                }

                if ((piece.rank === 6 || piece.rank === 7) && this.isValidJump(startX, startY, endX, endY)) {
                    return this.validateCapture(piece, targetPiece, false, false, endX, endY);
                }
                return false;
            }

            isValidJump(startX, startY, endX, endY) {
                if (this.isWater(endX, endY)) return false;

                const dx = Math.abs(endX - startX), dy = Math.abs(endY - startY);
                if (!((dx > 1 && dy === 0) || (dx === 0 && dy > 1))) return false;
                const minX = Math.min(startX, endX), maxX = Math.max(startX, endX);
                const minY = Math.min(startY, endY), maxY = Math.max(startY, endY);

                if (dy === 0) {
                    for (let x = minX + 1; x < maxX; x++) {
                        if (!this.isWater(x, startY) || this.getPieceAt(x, startY) !== null) return false;
                    }
                    return true;
                } else {
                    for (let y = minY + 1; y < maxY; y++) {
                        if (!this.isWater(startX, y) || this.getPieceAt(startX, y) !== null) return false;
                    }
                    return true;
                }
            }

            validateCapture(piece, targetPiece, startIsWater, endIsWater, endX, endY) {
                if (!targetPiece) return true;
                if (startIsWater !== endIsWater) return false;
                if (this.isTrap(endX, endY, piece.team)) return true;
                if (piece.rank === 1 && targetPiece.rank === 8) return true;
                if (piece.rank === 8 && targetPiece.rank === 1) return false;
                return piece.rank >= targetPiece.rank;
            }

            executeMove(piece, endX, endY) {
                const startX = piece.gridX;
                const startY = piece.gridY;
                const targetPiece = this.getPieceAt(endX, endY);
                let captured = null;

                if (startX === -1 && startY === 4) this.secretPieceLeft = null;
                else if (startX === 7 && startY === 4) this.secretPieceRight = null;
                else this.board[startX][startY] = null;

                if (targetPiece) {
                    captured = targetPiece;
                    this.pieces = this.pieces.filter(p => p !== targetPiece);
                }
                piece.gridX = endX;
                piece.gridY = endY;

                if (endX === -1 && endY === 4) this.secretPieceLeft = piece;
                else if (endX === 7 && endY === 4) this.secretPieceRight = piece;
                else this.board[endX][endY] = piece;

                // Easter egg activation: glass tile appears + banana
                if (endX === 0 && endY === 4 && !this.secretTileLeftActive && !this.easterEggConsumed) {
                    this.secretTileLeftActive = true;
                    this.bananaLeftActive = true;
                }
                if (endX === 6 && endY === 4 && !this.secretTileRightActive && !this.easterEggConsumed) {
                    this.secretTileRightActive = true;
                    this.bananaRightActive = true;
                }

                // Easter egg Phase 2: banana collection
                let bananaCollected = false;
                let bananaReturnPos = null;
                if (endX === -1 && endY === 4 && this.bananaLeftActive) {
                    bananaCollected = true;
                    this.leftBananaCollected = true;
                    this.bananaLeftActive = false;
                    this.secretTileLeftActive = false;
                    bananaReturnPos = { x: 0, y: 4 };
                    // Move piece back logically to A5
                    this.secretPieceLeft = null;
                    piece.gridX = 0; piece.gridY = 4;
                    this.board[0][4] = piece;
                    // Prepare banana timer for this team (will start AFTER fall sequence)
                    this.bananaTimers[piece.team] = { active: false, turnsLeft: 5, pending: true, origin: { x: 0, y: 4 } };
                } else if (endX === 7 && endY === 4 && this.bananaRightActive) {
                    bananaCollected = true;
                    this.rightBananaCollected = true;
                    this.bananaRightActive = false;
                    this.secretTileRightActive = false;
                    bananaReturnPos = { x: 6, y: 4 };
                    // Move piece back logically to G5
                    this.secretPieceRight = null;
                    piece.gridX = 6; piece.gridY = 4;
                    this.board[6][4] = piece;
                    // Prepare banana timer for this team (will start AFTER fall sequence)
                    this.bananaTimers[piece.team] = { active: false, turnsLeft: 5, pending: true, origin: { x: 6, y: 4 } };
                }

                const enemyTeam = piece.team === 0 ? 1 : 0;
                if (this.isDen(endX, endY, enemyTeam) || (piece.team !== 2 && this.pieces.filter(p => p.team === enemyTeam).length === 0)) {
                    this.winner = piece.team;
                }

                if (this.monkeyActive) {
                    // Save who's "really" next so monkey can yield the turn back
                    if (piece.team !== 2) this.nextTurnAfterMonkey = enemyTeam;
                    this.currentTurn = 2; // Monkey intercepts turn
                } else {
                    this.currentTurn = enemyTeam;
                }

                // Decrement banana timers each turn (only if active, not pending)
                let routeATriggered = false;
                let routeABananaOrigin = null;
                for (let t = 0; t < 2; t++) {
                    const bt = this.bananaTimers[t];
                    if (bt.active && !bt.pending) {
                        bt.turnsLeft--;
                        if (bt.turnsLeft <= 0) {
                            bt.active = false;
                            const otherTeam = t === 0 ? 1 : 0;
                            const otherBt = this.bananaTimers[otherTeam];
                            if (!otherBt.active && !otherBt.pending && !this.monkeyActive && !this.routeBResolved) {
                                routeATriggered = true;
                                routeABananaOrigin = bt.origin;
                                this.monkeyActive = true;
                                this.monkeyRage = 9;
                                this.easterEggConsumed = true;
                            }
                        }
                    }
                }

                // Check for Route B: both bananas collected
                let routeBTriggered = false;
                if (!this.routeBResolved && !this.monkeyActive) {
                    if (this.leftBananaCollected && this.rightBananaCollected) {
                        this.routeBResolved = true;
                        routeBTriggered = true;
                        const b0 = this.bananaTimers[0];
                        const b1 = this.bananaTimers[1];
                        b0.active = false; b0.pending = false;
                        b1.active = false; b1.pending = false;
                        this.easterEggConsumed = true;
                    }
                }

                // Check Route C: Game ends while someone holds a banana (and Route B hasn't triggered)
                let routeCTriggered = false;
                if (this.winner !== null && !this.routeBResolved && !this.monkeyActive) {
                    const b0 = this.bananaTimers[0];
                    const b1 = this.bananaTimers[1];
                    if ((b0.active || b0.pending) || (b1.active || b1.pending)) {
                        routeCTriggered = true;
                        this.easterEggConsumed = true;
                    }
                }

                logBattle(piece, startX, startY, endX, endY, captured);

                return { captured, bananaCollected, bananaReturnPos, routeATriggered, routeABananaOrigin, routeBTriggered, routeCTriggered, winner: this.winner };
            }
        }

        export const engine = new GameEngine();