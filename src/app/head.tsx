export default function Head() {
  return (
    <>
      <script
        id="force-light-mode"
        dangerouslySetInnerHTML={{
          __html: `try { localStorage.setItem('darkMode','false'); } catch {}; document.documentElement.classList.remove('dark');`,
        }}
      />
    </>
  );
} 