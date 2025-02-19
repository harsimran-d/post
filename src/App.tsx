import RequestForm from "./components/RequestForm";

function App() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="m-auto w-[600px] p-4 text-center text-3xl">Post</div>
      <RequestForm />
    </div>
  );
}
export default App;
