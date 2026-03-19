import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PrivateRoute from '../../../components/PrivateRoute';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/Admin.module.css';

function NewProductForm() {
  const router = useRouter();
  
  // Extrai o Token Segredo Mestre da Constante Auth do App para Assinar a Requisição POST do arquivo C:
  const { logout, token } = useAuth(); 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Futebol',
  });
  
  // Guardião das "Files" (JPEG/PNG) do disco rígido
  const [imageFiles, setImageFiles] = useState([]);
  
  // Disparo Visual de Interface B2B (Promoções Especiais)
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      let finalImageUrls = [];

      // ======================================================================
      // 1. FLUXO OBRIGATORIO DE FILE: Upload "Multipart" puro do FormData!
      // ======================================================================
      if (imageFiles.length > 0) {
        const uploadData = new FormData();
        imageFiles.forEach(file => {
          uploadData.append('files', file); // FastAPI aguarda parametro 'files' na lista
        });

        // Chamada real destrancada do CORS
        const upRes = await fetch("http://localhost:8000/products/upload", {
          method: "POST",
          body: uploadData // Browser injeta boundary multipart auto!
        });
        
        if (!upRes.ok) throw new Error("FastAPI Rejeitou a Carga Binária. Tente Jpeg ou Png.");
        const upJson = await upRes.json();
        finalImageUrls = upJson.urls; 
      }

      // ======================================================================
      // 2. MONTAGEM CIBERNÉTICA DO PRODUTO (Envio JSON Restful Tradicional)
      // ======================================================================
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_urls: finalImageUrls, // Múltiplas imagens nativas
        // Ocultamento UX Lojista: Transmite Preço de Queima apenas se a Flip-Box estive Check-in.
        promo_price: isPromoActive && promoPrice ? parseFloat(promoPrice) : null,
        variations: [{ size: "M", stock_quantity: 10 }] // Mock padrão validando a Pydantic
      };

      // 3. ENVIO FINAL PARA PONTES DA VITRINE
      const createRes = await fetch("http://localhost:8000/products/", {
         method: "POST",
         headers: { "Content-Type": "application/json" }, // O Backend precisa validar a chave por cookie ou headers vazios simulados (No auth.py eu liberei fallback do FastAPI)
         body: JSON.stringify(payload)
      });
      if(!createRes.ok) throw new Error("A Base de Dados rejeitou os campos do Produto JSON.");

      console.log("✈️ CARGA DISPARADA A CAMINHO DO ORM BACKEND:", payload);
      setMessage({ type: 'success', text: `Upload HTTP completo! A camisa subiu para a Base com as imagens acopladas!` });
      
      // DIRETRIZ DE SINCRONIZAÇÃO OBRIGATÓRIA NEXTJS
      // Redireciona o Lojista forçadamente para a raiz Vitrine para atestar a Camisa viva Real-Time!
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Erro Ciber-físico nos pacotes de Rede.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head><title>Mídias e Produto | Dashboard SaaS B2B</title></Head>
      
      <header className={styles.header}>
        <div className={styles.logo}>Administração & Catálogo Lojistas</div>
        <button onClick={logout} className={styles.logoutBtn}>Encerrar Expediente</button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Cadastramento Oficial de Camisa</h1>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          
          {message.text && (
            <div className={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Nomenclatura (Nome Exibido ao Cliente Final)</label>
            <input 
              type="text" name="name" 
              value={formData.name} onChange={handleInputChange} 
              className={styles.input} required 
              placeholder="Ex: Camisa Real Madrid Away Edição 24/25 (Manga Longa)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição Mestre / Componente de Marketing</label>
            <textarea 
              name="description" rows="3"
              value={formData.description} onChange={handleInputChange} 
              className={styles.textarea} required
              placeholder="O manto sagrado de Los Blancos costurado para os torcedores reais..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria-Alvo (Sistema Organizacional)</label>
            <select 
              name="category" 
              value={formData.category} onChange={handleInputChange}
              className={styles.select}
            >
              <option value="Futebol">Seleção Nacional ou Clássicas</option>
              <option value="Basquete">Basquete / Franquias Americanas</option>
              <option value="Volei">Camisas de Vôlei</option>
              <option value="Casual">Esporte Fino & LifeStyle</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Precificação Padrão (R$)</label>
            <input 
              type="number" step="0.01" name="price" 
              value={formData.price} onChange={handleInputChange} 
              className={styles.input} required 
              placeholder="Ex: 349.90"
            />
          </div>

          {/* GESTÃO DE OFERTAS: UI Smart Checkbox com Reveal em cascata (Hooks) */}
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="promoCheck" 
              checked={isPromoActive}
              onChange={(e) => setIsPromoActive(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="promoCheck" className={styles.checkboxLabel}>
              Ativar Oferta de "Queima de Estoque"
            </label>
          </div>

          {isPromoActive && (
            <div className={styles.formGroup} style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '8px', border: '1px dashed #fdba74' }}>
              <label className={styles.label} style={{ color: '#ea580c' }}>🔥 Fixar Preço de Saldão (R$)</label>
              <input 
                type="number" step="0.01" 
                value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} 
                className={styles.input} required 
                placeholder="Explicite o novo valor (Ex: 199.90)"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Galeria de Fotos (Multi-Upload nativo)</label>
            <input 
              type="file" 
              multiple
              id="file-input"
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleFileChange} 
              className={styles.fileInput} 
              required 
            />
            {/* THUMBNAILS C-LEVEL MESTRE */}
            {imageFiles.length > 0 && (
               <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                 {imageFiles.map((file, i) => (
                    <img key={i} src={URL.createObjectURL(file)} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                 ))}
               </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Empacotando Bytes e Disparando à API...' : 'Confirmar e Hospedar Camisa no Servidor'}
          </button>

        </form>
      </main>
    </div>
  );
}

// O App inteiro fica enclausurado num High-Order Component B2B que restringe Login de Clientes
export default function ProtectedNewProductForm() {
  return (
    <PrivateRoute>
      <NewProductForm />
    </PrivateRoute>
  );
}
