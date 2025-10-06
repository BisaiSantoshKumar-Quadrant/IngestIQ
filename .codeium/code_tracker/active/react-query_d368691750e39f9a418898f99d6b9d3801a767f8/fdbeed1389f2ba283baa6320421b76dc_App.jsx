…	import logo from './logo.svg';
import './App.css';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { wait } from '@testing-library/user-event/dist/utils';
const POSTS = [
  {id : 1, title: 'post 1'},
  {id : 2, title: 'post 2'}
]
function App() {
  const queryClient = useQueryClient()
  const postQuery = useQuery({
    queryKey : ['posts'],
    queryFn : ()=> wait(1000).then(()=>[...POSTS])
  })
 
  const newPostMutation = useMutation({
    mutationFn: title => {
      return wait(1000).then(()=> POSTS.push({id:crypto.randomUUID(), title})  
    )
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries(['posts'])
    }
  })

  if (postQuery.isLoading) return <h1>Loading...</h1>
  if (postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>
  
  console.log(POSTS)

  return (
    <div>
      <h1> React Query</h1>
      {postQuery.data.map(post => (
      <div key = {post.id}>
        {post.title}
        </div>
      ))}
      <button disabled = {newPostMutation.isLoading} onClick = {()=> newPostMutation.mutate("new post")}> add new</button>


    </div>

  );
}

export default App;
3 3U U``g 0g*$d4a9487c-61a6-45c9-8f7f-3630359434ea08	€ €¿
¿Ø 4Øâ *$9d580906-edea-483a-a4e1-d846de9b1ba008âæ4æé *$9d580906-edea-483a-a4e1-d846de9b1ba008
éê 2êë*$9d580906-edea-483a-a4e1-d846de9b1ba008
ëî 4î‡ *$635b3d50-103a-46a7-94eb-544b2d41e1a608
‡Š 
Š› 
›Ú 2ÚÜ*$e9064587-814d-48cc-9aac-9e0bf65536b108
Ü÷ 
÷ş 
şÇ 
ÇÌ 
Ìé 
éğ 
ğ‚ 
‚ 
˜ 
˜ 
§ §ª
ª­ ­¿
¿Ã 
ÃĞ 
ĞÕ 
ÕÜ 
Üñ 
ñò 
ò¿ 2¿Æ*$d79c3d26-be42-43b2-8f4e-56949330a10708
Æı ı‰
‰“ 2“•*$3f004aa2-d453-47f1-9c14-bade58ed125c08
•¨ ¨´
´è 
è…	 "(d368691750e39f9a418898f99d6b9d3801a767f82?file:///c:/Users/BisaiSantoshKumar%28Qu/react-query/src/App.jsx:3file:///c:/Users/BisaiSantoshKumar%28Qu/react-query