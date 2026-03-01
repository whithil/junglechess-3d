/**
 * VR Adjust Tool - Debug Utility
 * 
 * Uma ferramenta simples para reposicionar e rotacionar modelos 3D ("assets") usando
 * os analógicos dos controles WebXR em tempo real, jogando as coordenadas finais no console.
 * 
 * Como usar:
 * No seu loop de renderização (handleXRInput), chame esta função passando os parâmetros:
 * obj: O Object3D (ou Group) do Three.js que você quer posicionar
 * source: A XRInputSource sendo iterada naquele momento
 * 
 * Controles:
 *  - Analógico sozinho: Move X e Y
 *  - Squeeze (Grip) + Analógico: Move Z e Rotaciona Z
 *  - Trigger + Analógico: Rotaciona X e Y
 */

export function updateVRAdjustment(obj, source) {
    if (!source || !source.gamepad || source.gamepad.axes.length < 4) return false;

    const thumbstickX = source.gamepad.axes[2];
    const thumbstickY = source.gamepad.axes[3];

    // Se o analógico foi movido mais que a "zona morta"
    if (Math.abs(thumbstickX) > 0.1 || Math.abs(thumbstickY) > 0.1) {
        const isSqueeze = source.gamepad.buttons[1] && source.gamepad.buttons[1].pressed;
        const isTrigger = source.gamepad.buttons[0] && source.gamepad.buttons[0].pressed;

        if (!isSqueeze && !isTrigger) {
            // Analógico livre: Translada X (esquerda/direita) e Y (cima/baixo)
            obj.position.x += thumbstickX * 0.002;
            obj.position.y -= thumbstickY * 0.002;
        } else if (isSqueeze && !isTrigger) {
            // Grip segurado: Translada Z (frente/trás) e Gira no eixo Z
            obj.position.z -= thumbstickY * 0.002;
            obj.rotation.z -= thumbstickX * 0.03;
        } else if (isTrigger) {
            // Gatilho segurado: Gira no eixo X e Y
            obj.rotation.x -= thumbstickY * 0.03;
            obj.rotation.y -= thumbstickX * 0.03;
        }

        // Loga as coordenadas arredondadas pra facilitar copiar e colar pro código final
        console.log(`[VR ADJUST] \nposition.set(${obj.position.x.toFixed(4)}, ${obj.position.y.toFixed(4)}, ${obj.position.z.toFixed(4)});\nrotation.set(${obj.rotation.x.toFixed(4)}, ${obj.rotation.y.toFixed(4)}, ${obj.rotation.z.toFixed(4)});\n`);

        // Retorna true indicando que o controle consumiu o uso do analógico neste frame
        return true;
    }
    return false;
}
