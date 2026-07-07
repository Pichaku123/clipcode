import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import SnippetList from "./pages/SnippetList";
import SnippetForm from "./pages/SnippetForm";
import SnippetDetail from "./pages/SnippetDetail";
import ProblemList from "./pages/ProblemList"; 
import ProblemForm from "./pages/ProblemForm";
import ProblemDetail from "./pages/ProblemDetail";
import PatternList from "./pages/PatternList";
import PatternDetail from "./pages/PatternDetail";
 
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<App />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/snippets" element={<SnippetList />} />
                    <Route path="/snippets/new" element={<SnippetForm />} />
                    <Route path="/snippets/:id" element={<SnippetDetail />} />
                    <Route path="/snippets/:id/edit" element={<SnippetForm />} />
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problems/new" element={<ProblemForm />} />
                    <Route path="/problems/:id" element={<ProblemDetail />} />
                    <Route path="/patterns" element={<PatternList />} />
                    <Route path="/patterns/:id" element={<PatternDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);

