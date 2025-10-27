import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Initial Data ---
const initialInvitationData = {
    groom1: "Noivo 1",
    groom2: "Noivo 2",
    mainNames: "Dedalo Silva & Rosa Amadel",
    date: "29 | NOVEMBRO | 2025",
    ceremony: "Realizar-se-á na Paróquia Nossa Senhora de Fátima (Ex São Domingo), às 14h00.",
    reception: "Terá Lugar no Salão de Festas Silv Place\nLocalizado no Nova Vida Rua 45, às 16h00.",
    contact: "+Info: +244 923 923 965 | 930076341",
};

// --- SVG Icons & Decorations ---
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);
const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
);
const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm10 15a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 01-1 1z" clipRule="evenodd" />
    </svg>
);
const Decoration = ({ className = '' }) => (
    <svg className={`w-full h-auto text-[#d4bca9] ${className}`} viewBox="0 0 400 50" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 25 C 50 0, 150 50, 200 25 C 250 0, 350 50, 400 25 L 400 30 C 350 55, 250 5, 200 30 C 150 55, 50 5, 0 30 Z" opacity="0.4" />
        <path d="M0 25 C 50 10, 150 40, 200 25 C 250 10, 350 40, 400 25" stroke="currentColor" fill="none" strokeWidth="0.5" />
    </svg>
);
const QrCodePlaceholder = () => (
     <svg className="w-16 h-16 text-[#a1806b]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M10 10h30v30h-30z M15 15h20v20h-20z M60 10h30v30h-30z M65 15h20v20h-20z M10 60h30v30h-30z M15 65h20v20h-20z M60 60h30v30h-30z M65 65h20v20h-20z M45 45h10v10h-10z M45 60h10v10h-10z M60 45h10v10h-10z M75 45h15v10h-15z M45 75h10v15h-10z M45 10h10v10h-10z M10 45h10v10h-10z M25 45h10v10h-10z" />
    </svg>
);


// --- Reusable Input Components ---
const commonInputStyles = "bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-[#a1806b] focus:bg-[#f6f1e9]/50 rounded-md p-1 transition-all";
const disabledStyles = "disabled:cursor-default";
const enabledStyles = "cursor-text";

const EditableInput = ({ name, value, isEditing, onChange, className = '' }) => (
    <input
        type="text"
        name={name}
        value={value}
        disabled={!isEditing}
        onChange={onChange}
        className={`${commonInputStyles} ${isEditing ? enabledStyles : disabledStyles} ${className}`}
    />
);

const EditableTextarea = ({ name, value, isEditing, onChange, className = '' }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);
    
    return (
        <textarea
            ref={textareaRef}
            name={name}
            value={value}
            disabled={!isEditing}
            onChange={onChange}
            rows={1}
            className={`${commonInputStyles} resize-none overflow-hidden ${isEditing ? enabledStyles : disabledStyles} ${className}`}
        />
    );
};

const ControlButton = ({ onClick, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center px-4 py-2 bg-[#e9e0d7] text-[#5a3a2e] border border-[#d4bca9] rounded-lg shadow-sm hover:bg-[#d4bca9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a1806b] focus:ring-offset-[#fdfaf3] transition-colors duration-200 ${className}`}
    >
        {children}
    </button>
);


// --- Main Application Component ---
const Invitation = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [invitationData, setInvitationData] = useState(initialInvitationData);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setInvitationData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleEdit = useCallback(() => setIsEditing(true), []);
    const handleSave = useCallback(() => setIsEditing(false), []);

    const handleClear = useCallback(() => {
        if (window.confirm('Deseja realmente limpar todos os campos?')) {
            setInvitationData({
                groom1: "",
                groom2: "",
                mainNames: "",
                date: "",
                ceremony: "",
                reception: "",
                contact: "",
            });
            setIsEditing(true);
        }
    }, []);

    const handlePrint = useCallback(() => {
        setIsEditing(false);
        setTimeout(() => {
            window.print();
        }, 100);
    }, []);

    return (
        <main className="main-container bg-[#fdfaf3] text-[#5a3a2e] min-h-screen flex flex-col items-center justify-start p-4 md:p-8 selection:bg-[#d4bca9]">
            {/* Controls Section */}
            <div className="no-print w-full max-w-2xl p-4 mb-8 bg-[#f6f1e9] rounded-xl shadow-md border border-[#d4bca9]">
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {isEditing ? (
                        <ControlButton onClick={handleSave}><SaveIcon /> Concluído</ControlButton>
                    ) : (
                        <ControlButton onClick={handleEdit}><EditIcon /> Editar</ControlButton>
                    )}
                    <ControlButton onClick={handlePrint}><PrintIcon /> Imprimir</ControlButton>
                    <ControlButton onClick={handleClear}><ClearIcon /> Limpar</ControlButton>
                </div>
            </div>

            {/* Invitation Card Section */}
            <div id="convite" className="invitation-container relative w-full max-w-2xl aspect-[5/7] bg-[#fdfaf3] shadow-2xl rounded-lg border-2 border-[#d4bca9] p-8 md:p-12 overflow-hidden flex flex-col items-center text-center scale-90 md:scale-100 origin-top">
                <div className="absolute top-0 left-0 right-0">
                    <Decoration />
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <Decoration className="transform rotate-180" />
                </div>

                <div className="conteudo z-10 flex flex-col items-center h-full w-full">
                    <div className="logo-iniciais font-great-vibes text-6xl md:text-7xl text-[#a1806b]">AR</div>
                    
                    <div className="citacao mt-4 text-xs tracking-widest">
                        "O amor é paciente, o amor é bondoso."<br/>1 CORÍNTIOS 13:4
                    </div>

                    <div className="benção mt-6 text-sm font-semibold tracking-wider">
                        COM A BÊNÇÃO DE DEUS E DE SEUS PAIS,
                    </div>

                    <div className="noivos flex justify-center gap-4 mt-1 text-xs">
                        <div className="noivo">
                            <EditableInput name="groom1" value={invitationData.groom1} isEditing={isEditing} onChange={handleInputChange} className="tracking-widest font-semibold" />
                        </div>
                        <div className="noivo">
                            <EditableInput name="groom2" value={invitationData.groom2} isEditing={isEditing} onChange={handleInputChange} className="tracking-widest font-semibold" />
                        </div>
                    </div>

                    <div className="nomes-principais mt-3 font-great-vibes text-4xl md:text-5xl text-[#8c674c]">
                        <EditableInput name="mainNames" value={invitationData.mainNames} isEditing={isEditing} onChange={handleInputChange} className="font-great-vibes"/>
                    </div>

                    <div className="convite-texto mt-3 text-base">Convidam para o seu Enlace Matrimonial</div>
                    
                    <div className="linha-divisoria w-24 h-[1px] bg-[#d4bca9] my-4"></div>

                    <div className="data text-sm">A realizar-se no dia</div>
                    
                    <div className="data-destaque mt-1 text-xl font-bold tracking-widest">
                        <EditableInput name="date" value={invitationData.date} isEditing={isEditing} onChange={handleInputChange} className="font-bold tracking-widest" />
                    </div>

                    <div className="cerimonia mt-4 w-full px-4">
                        <div className="cerimonia-titulo text-sm font-semibold tracking-wider">CERIMÔNIA RELIGIOSA</div>
                        <div className="cerimonia-info mt-1 text-sm">
                            <EditableTextarea name="ceremony" value={invitationData.ceremony} isEditing={isEditing} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="recepcao mt-4 w-full px-4">
                        <div className="recepcao-titulo text-sm font-semibold tracking-wider">COPO-D'ÁGUA</div>
                        <div className="recepcao-info mt-1 text-sm">
                            <EditableTextarea name="reception" value={invitationData.reception} isEditing={isEditing} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="flex-grow"></div>
                    
                    <div className="rodape-info w-full flex items-end justify-between mt-4">
                        <div className="qr-code">
                            <QrCodePlaceholder />
                        </div>
                        <div className="info-rodape text-right text-xs">
                            <strong>Por gentileza, não leve crianças<br/>É confirmar a Presença</strong>
                            <div className="w-full">
                               <EditableInput name="contact" value={invitationData.contact} isEditing={isEditing} onChange={handleInputChange} className="text-right text-xs" />
                            </div>
                            <strong>Endereço</strong>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Invitation;
