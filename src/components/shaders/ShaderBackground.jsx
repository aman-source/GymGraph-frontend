import ShaderCanvas from './ShaderCanvas';

export default function ShaderBackground({ fragmentShader, className = "" }) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <ShaderCanvas fragmentShader={fragmentShader} />
    </div>
  );
}
