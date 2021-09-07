module.exports = {
  apps : [{
    name:'uploadzip',
    script: './dist/main.js',
    autorestart: true,
    node_args:'-expose-gc',
    args:['--max_semi_space_size=64','--max_old_space_size=2048'],
    watch: false,
    max_memory_restart: '3G'
  }]
};
