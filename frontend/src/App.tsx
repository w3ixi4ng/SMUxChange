import RouterView from './routes/Router.tsx';
import { Toaster } from "@/components/ui/sonner"  


function App() {
  return (
    <>
      <RouterView />
      <Toaster richColors />
    </>
  );
}

export default App;
