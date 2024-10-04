{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "node";
  buildInputs = [ pkgs.nodejs_22 ];
  shellHook = ''
    mkdir -p "$PWD/.npm_global"
    export PATH="$PWD/node_modules/.bin/:$PWD/.npm_global/bin:$PATH"
    export npm_config_prefix="$PWD/.npm_global"
  '';
}
