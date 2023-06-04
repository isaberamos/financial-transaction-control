import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../../../contexts/TransactionsContext";
import { useContextSelector } from 'use-context-selector';

/* Por que um componente renderiza?
    - Hooks changed (mudou o estado, contexto, reducer)
    - Props changed (mudou propriedades)
    - Parent rerendered (componente pai renderizou)

    Qual o fluxo de renderização?
    1. O react recria o HTML da interface daquele componente
    2. Compara a versão do HTML recriada com a versão anterior
    3. SE mudou alguma coisa, ele reescreve o HTML na tela

    O memo é usado para memorizar um componente, alterando um pouco o fluxo listado acima.
    0: Hooks changed, Props changed (deep comparison)
    0.1: Compara com a versão anterior dos hooks e props
    0.2: SE mudou algo, ele vai permitir a nova renderização

    Poderia usar dessa forma:
    
    function SearchForm() {

    export const SearchForm = memo(SearchFormComponent)
*/

// O zod cria o schema do formulário

const searchFormSchema = z.object({
    query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>


export function SearchForm() {
    const fetchTransactions = useContextSelector(TransactionsContext, (context) => {
        return context.fetchTransactions
    })

    const { 
        register, 
        handleSubmit,
        formState: {isSubmitting}
    } = useForm<SearchFormInputs>({
        resolver: zodResolver(searchFormSchema)
    })

    // handle é mais usado para quando o usuário que requisita
    // funçã que pegará os dados escritos pelo usuário
    async function handleSearchTransactions(data: SearchFormInputs) {
        await fetchTransactions(data.query)

        console.log(data.query)
    }

    return (
        <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}
        >
            <input 
            type="text" 
            placeholder="Busque por transações"
            {...register('query')}
            />

            <button type="submit" disabled={isSubmitting}>
                <MagnifyingGlass size={20}/>
                Buscar
            </button>
        </SearchFormContainer>
    )
}