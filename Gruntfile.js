'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      'public': ['public'],
      'public-fonts': ['public/fonts'],
      'public-images': ['public/images'],
      'public-js': ['public/javascripts'],
      'public-stylesheets': ['public/stylesheets'],
      'public-templates': ['public/templates'],
      'public-vendor': ['public/vendor'],
      'generated': ['webclient/generated'],
      'bower':['webclient/vendor']
    },
    less: {
      appClient: {
        options: {
          cleancss: 'true'
        },
        files: {
          'public/styles.css':'webclient/less/styles.less'
        }
      }
    },
    ngAnnotate: {
      all: {
        src:'webclient/generated/js/app.js',
        dest: 'webclient/generated/js/app.ngannotate.js'
      }
    },
    ngtemplates: {
      tapestry: {
        cwd:'webclient',
        src: ['templates/**/*.html'],
        dest: 'webclient/generated/js/templates.js',
        module: 'myapp',
        options:    {
          htmlmin:  {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            keepClosingSlash:true,
            minifyJS:true,
            minifyCSS:true
          }
        }
      }
    },
    concat: {
      appClient: {
        src : [
          'webclient/js/app.js',
          'webclient/generated/templates.js',
          'webclient/js/**/*.js',
          'webclient/js/app-config.js'
        ],
        dest: 'webclient/generated/js/app.js'
      }
    },
    copy: {
      templates: {
        expand: true,
        cwd:'webclient/templates/',
        src: ['*.html', '**/*.html'],
        dest: 'public/templates'
      },
      fonts : {
        expand: true,
        cwd:'webclient',
        src: ['fonts/**'],
        dest: 'public'
      },
      images: {
        expand: true,
        cwd:'webclient',
        src: ['images/**'],
        dest: 'public'
      },
      js : {
        src: 'webclient/generated/js/app.js',
        dest: 'public/js/app.js'
      },
      vendor: {
        expand: true,
        cwd:'webclient',
        src: ['vendor/**'],
        dest: 'public'
      },
      index: {
        src: 'webclient/index.html',
        dest: 'public/index.html'
      }
    },
    uglify: {
      appClient: {
        files: {
          'public/js/app.min.js' : ['webclient/generated/js/app.ngannotate.js']
        }
      }
    },
    jshint: {
      options: {
        force: true,
        reporter:  require('jshint-stylish'),
        bitwise:   true,
        eqeqeq:    true,
        curly:     true,
        immed:     true,
        latedef:   true,
        newcap:    true,
        noarg:     true,
        noempty:   true,
        nonbsp:    true,
        nonew:     true,
        sub:       true,
        undef:     true,
        unused:    true,
        boss:      true,
        eqnull:    true,
        node:      true,
        jquery:    true,
        quotmark: 'single',
        camelcase: true,
        strict:    true,
        indent:    2,
        ignores: ['node_modules/**', 'public/vendor/**', 'webclient/vendor/**', 'webclient/generated/**']
      },
      frontEndDevelopment: {
        files: {
          src: [
            'Gruntfile.js',
            'webclient/js/*.js',
            'webclient/js/**/*.js',
            'webclient/js/**/**/*.js'
          ]
        },
        options: {
          globals: {
            'angular': false,
            'myapp': true
          }
        }
      }
    },
    env: {
      dev: {
        NODE_ENV: 'development',
        NODE_PORT: '9080',
        NODE_DOMAIN: 'localhost',
        APP_PORT: '9080',
        APP_DOMAIN: 'localhost'
        //Add other environment variables here, such as connection parameters
        //to various databases (redis, elasticsearch, etc.) in the Vagrant dev VM.
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          ignore: ['node_modules/**'],
          ext: 'js',
          delay: 1000
        }
      }
    },
    watch: {
      options: {
        spawn: false
      },
      js: {
        files: [
          'webclient/js/**/*.js',
          'webclient/templates/**/*.html'
        ],
        tasks: ['clean:public-js','clean:public-templates','clean:generated','build']
      },
      less: {
        files: [
          'webclient/less/**/*.less'
        ],
        tasks: ['clean:public-stylesheets','less']
      },
      assets: {
        files: [
          'webclient/images/**/*',
          'webclient/fonts/**/*'
        ],
        tasks:['clean:public-images', 'clean:public-fonts', 'copy:images', 'copy:fonts']
      },
      index: {
        files: ['webclient/index.html'],
        tasks: ['copy:index']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower-install']
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-ng-annotate');

  //Use the real bower instead of the fragile grunt plugins that wrap it
  grunt.registerTask('bower-install', 'install front-end dependencies using bower', function() {
    var done = this.async();
    require('child_process')
      .spawn('bower', ['install'], {stdio:'inherit'})
      .on('exit', function(error) {
        done(error);
      });
  });

  grunt.registerTask('build-js', [
    'jshint:frontEndDevelopment',
    'ngtemplates',
    'concat:appClient',
    'ngAnnotate',
    'uglify:appClient',
    'copy:js',
    'copy:templates'
  ]);

  grunt.registerTask('build', [
    //'bower-install',
    'build-js',
    'less',
    'copy:fonts',
    'copy:images',
    'copy:vendor',
    'copy:index'
  ]);

  grunt.registerTask('default', ['bower-install', 'env:dev', 'build', 'concurrent']);
};
