import { LANGUAGE_VERSIONS } from "./constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#FFD600";

interface LanguageSelectorProps {
    language: string;
    onSelect: (lang: string) => void;
};

const LanguageSelector = ({
    language,
    onSelect
}: LanguageSelectorProps) => {
    return (
        <div className="p-2 flex text-white text-sm">
            {languages.map(([lang]) => (
                <div
                    key={lang}
                    style={{
                        color: lang === language ? ACTIVE_COLOR : "inherit",
                        backgroundColor: lang === language ? "#434343" : "transparent",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                    className="px-3 py-1 rounded"
                    onClick={() => onSelect(lang)}
                >
                    {lang}&nbsp;
                </div>
            ))}
        </div>
    );
};

export default LanguageSelector;
