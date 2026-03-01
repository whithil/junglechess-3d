// ==========================================/
        // I18N DICTIONARY INITIALIZATION
        // ==========================================/
        let i18nData = {};
        const lang = navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US';
        try {
            const res = await fetch(`lang/${lang}.yml`);
            if (res.ok) {
                i18nData = jsyaml.load(await res.text());
            } else {
                const resFb = await fetch(`lang/en-US.yml`);
                i18nData = jsyaml.load(await resFb.text());
            }
        } catch (e) {
            console.warn("I18N Load Error:", e);
        }

        window.i18n = function (path) {
            const keys = path.split('.');
            let val = i18nData;
            for (let k of keys) {
                if (val && val[k] !== undefined) val = val[k];
                else return path; // Return the key path if not found
            }
            return val;
        };