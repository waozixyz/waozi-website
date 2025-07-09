{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    zola
    cargo
    rustc
    git
  ];

  shellHook = ''
    echo "🚀 Waozi Website Development Environment"
    echo "Available commands:"
    echo "  zola serve    - Run development server"
    echo "  zola build    - Build static site"
    echo "  zola check    - Check site for issues"
    echo ""
    echo "Galaxy-themed personal website ready! 🌌"
  '';
}