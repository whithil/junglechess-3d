// ==========================================/
        // SISTEMA DE ÁUDIO ARCADE PROCEDURAL
        // ==========================================/
        let audioCtx = null;
        export function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function createNoiseBuffer() {
            const bufferSize = audioCtx.sampleRate * 2.5;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            return buffer;
        }

        function playThump(now, buffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(40, now + 0.5);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.8, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            source.start(now);
        }

        function playChurn(now, buffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, now);
            filter.Q.setValueAtTime(2, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            source.start(now);
        }

        function playSpray(now, buffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3000, now);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            source.start(now);
        }

        export function playSound(type) {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            if (type === 'splash') {
                const buffer = createNoiseBuffer();
                playThump(now, buffer);
                playChurn(now, buffer);
                playSpray(now, buffer);
                return;
            }
            const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            if (type === 'jump') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(250, now); osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);
                gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
            } else if (type === 'squash') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
                gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
            } else if (type === 'morph') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.3, now + 0.1); gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
            } else if (type === 'beep') {
                osc.type = 'square'; osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'beep-up') {
                osc.type = 'square'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
                gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'nervous') {
                osc.type = 'triangle'; osc.frequency.setValueAtTime(350, now);
                osc.frequency.linearRampToValueAtTime(300, now + 0.1); osc.frequency.linearRampToValueAtTime(380, now + 0.2);
                osc.frequency.linearRampToValueAtTime(300, now + 0.3); osc.frequency.linearRampToValueAtTime(350, now + 0.4);
                gain.gain.setValueAtTime(0.25, now); gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now); osc.stop(now + 0.5);
            } else if (type === 'cheeky') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(500, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
            } else if (type === 'win') {
                osc.type = 'square'; const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25, 659.25, 783.99, 1046.50]; let timeOffset = 0;
                gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
                notes.forEach((freq, index) => { osc.frequency.setValueAtTime(freq, now + timeOffset); timeOffset += (index >= notes.length - 2) ? 0.4 : 0.15; });
                gain.gain.setValueAtTime(0.3, now + timeOffset); gain.gain.linearRampToValueAtTime(0, now + timeOffset + 1.5);
                osc.start(now); osc.stop(now + timeOffset + 1.5);
            } else if (type === 'fall') {
                // Long descending whistle — cartoonish abyss fall
                osc.type = 'sine'; osc.frequency.setValueAtTime(900, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 2.5);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.linearRampToValueAtTime(0.25, now + 1.5);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
                osc.start(now); osc.stop(now + 2.8);
            } else if (type === 'glass_break') {
                // Short glass shatter — noise burst + high frequency
                const nBuf = createNoiseBuffer();
                const nSrc = audioCtx.createBufferSource(); nSrc.buffer = nBuf;
                const hpf = audioCtx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.setValueAtTime(4000, now);
                const gn = audioCtx.createGain(); gn.gain.setValueAtTime(0.5, now); gn.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                nSrc.connect(hpf); hpf.connect(gn); gn.connect(audioCtx.destination); nSrc.start(now); nSrc.stop(now + 0.4);
                // Tinkle overlay
                osc.type = 'sine'; osc.frequency.setValueAtTime(2000, now); osc.frequency.exponentialRampToValueAtTime(6000, now + 0.1);
                gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
            } else if (type === 'land_safe') {
                // Soft landing thud
                osc.type = 'sine'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
                gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
            }
        }