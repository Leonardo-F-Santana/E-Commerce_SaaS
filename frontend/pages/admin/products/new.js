import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PrivateRoute from '../../../components/PrivateRoute';
import styles from '../../../styles/AdminProductForm.module.css';

export default function NewProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clubes',
    price: ''
  });
  
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // MOCK SUBMIT ROUTE - Na versão full-stack, usariamos Multipart/FormData
    // E.g.: 
    // const payload = new FormData();
    // payload.append("image", file); // AWS S3 bucket upload
    // payload.append("json", JSON.stringify(formData)); 
    // await axiosInstance.post('/products/', payload);
    
    alert(`🎉 Camisa esportiva "${formData.name}" cadastrada com exclusividade no Tenant atual!`);
    
    // Devolve para a tela mestre
    router.push('/admin/dashboard');
  };

  return (
    <PrivateRoute>
      <Head>
        <title>Nova Camisa | Admin E-Commerce</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.formBox}>
          <Link href="/admin/dashboard" className={styles.backLink}>
            &larr; Voltar para Dashboard
          </Link>
          
          <h1 className={styles.title}>Subir Nova Camisa</h1>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Foto / Mockup (Frente e Verso)</label>
              <div className={styles.fileBox}>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome Oficial Título da Camisa</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ex: Camisa Argentina Home 2024 Torcedor M"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Categoria Prateleira</label>
              <select 
                className={styles.input}
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Clubes">Times de Todo Mundo (Clubes)</option>
                <option value="Seleções">Seleções Nacionais (Copa)</option>
                <option value="Retrô">Coleção Vintage / Retrô</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Preço Fixo de Venda (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className={styles.input} 
                placeholder="Ex: 299.90"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Salvar Nova Camisa
            </button>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
}
