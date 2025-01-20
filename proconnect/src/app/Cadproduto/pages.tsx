export default function Cadproduto() {
    return (
        <div>
    <label htmlFor="arquivo">Coloque aqui a sua logo</label>
    <input type="file" />

    <label htmlFor="nome">Nome da sua marca</label>
    <input type="text" />
    
    <label htmlFor="categoria">Categoria</label>
    <select name="categ" id="categ">
    <option value="Beleza">Alimento</option>
    <option value="Saúde">Beleza</option>
    <option value="Alimento">Saúde</option>
    <option value="Obra">Obra</option>
    </select>

    <label htmlFor="localização">Localização</label>
    <select name="local" id="local">
    <option value="Santo Antonio">Santo Antonio</option>
    <option value="Dom Expedito">Dom Expedito</option>
    <option value="Sussuapara">Sussuapara</option>
    <option value="Picos">Picos</option>
    </select>
  
    <label htmlFor="email">Email</label>
    <input type="email" name="email" id="email" />

    <label htmlFor="Tel">Telefone</label>
    <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
    <label htmlFor="instagram">instagram</label>
<input type="url" name="instagram" id="instagram" />
<label htmlFor="linkedin">Linkedin</label>
<input type="url" name="linkedin" id="linkedin" />

<label htmlFor="descrição">Descrição</label>
    <input type="text" />

<label htmlFor="preço">Preço</label>
    <input type="text" />
 <input type="submit" />
    </div>
     
    );
   } 