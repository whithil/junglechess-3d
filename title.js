// --- JUNGLE CHESS 3D LOGO SNIPPET ---
// Requisitos: Three.js, TTFLoader e opentype.js (para ler .ttf nativamente)
// Uso: const logo = createJungleChessLogo(scene, camera);

import * as THREE from 'three';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export function createJungleChessLogo(scene, camera) {
    const logoGroup = new THREE.Group();
    let clock = new THREE.Clock();

    // Materiais PBR estilizados (Frente e Lado separados)

    // JUNGLE
    const matJungleFront = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3, metalness: 0.1 });
    const matJungleSide = new THREE.MeshStandardMaterial({ color: 0x022c22, roughness: 0.5, metalness: 0.1 }); // Verde escuro

    // CHESS
    const matChessFront = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.4, emissive: 0x451a03, emissiveIntensity: 0.1 });
    const matChessSide = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5, metalness: 0.2 }); // Marrom escuro

    // 3D
    const mat3DFront = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1, metalness: 0.6 });
    const mat3DSide = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.5, metalness: 0.2 }); // Vermelho/Marrom escuro

    // Carregar a fonte TTF original (Titan One) para manter o design exato
    const loader = new TTFLoader();
    loader.load('https://raw.githubusercontent.com/google/fonts/main/ofl/titanone/TitanOne-Regular.ttf', function (json) {
        const font = new Font(json);

        // Agora aceita um array de materiais (matArray)
        function createText(text, matArray, size, height, yPos, zPos) {
            const geo = new TextGeometry(text, {
                font: font, size: size, height: height,
                curveSegments: 12, bevelEnabled: true,
                bevelThickness: size * 0.08, bevelSize: size * 0.03, bevelSegments: 3
            });
            geo.computeBoundingBox();
            const xOffset = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
            // Passamos o array de materiais. Index 0 = Frente, Index 1 = Lados
            const mesh = new THREE.Mesh(geo, matArray);
            mesh.position.set(xOffset, yPos, zPos);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        }

        const meshJungle = createText("JUNGLE", [matJungleFront, matJungleSide], 30, 15, 30, -5);
        const meshChess = createText("CHESS", [matChessFront, matChessSide], 45, 25, -20, 10);
        const mesh3D = createText("3D", [mat3DFront, mat3DSide], 38, 30, -65, 30);

        // Ajuste manual de centralização do 3D (mais curto)
        mesh3D.position.x += 10;

        logoGroup.add(meshJungle);
        logoGroup.add(meshChess);
        logoGroup.add(mesh3D);

        // Setup final
        scene.add(logoGroup);

        // Remove loading state (se existir)
        const loaderUi = document.getElementById('loading-indicator');
        if (loaderUi) loaderUi.style.display = 'none';
    });

    // Lógica de atualização (Chama isto no teu requestAnimationFrame)
    // Ex: logoGroup.userData.update();
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    logoGroup.userData.update = function () {
        const time = clock.getElapsedTime();

        if (logoGroup.userData.baseY === undefined) {
            logoGroup.userData.baseY = logoGroup.position.y;
        }

        // Flutuação suave
        logoGroup.position.y = logoGroup.userData.baseY + Math.sin(time * 1.5) * 0.15;

        // Parallax do rato (rotação leve)
        const targetRotX = mouseY * 0.2;
        const targetRotY = mouseX * 0.3;

        logoGroup.rotation.x += (targetRotX - logoGroup.rotation.x) * 0.05;
        logoGroup.rotation.y += (targetRotY - logoGroup.rotation.y) * 0.05;
    };

    return logoGroup;
}
