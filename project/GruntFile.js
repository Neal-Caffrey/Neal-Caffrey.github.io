var path = require('path'),
    clamUtil = require('clam-util'),
    exec = require('child_process').exec,
    fs = require('fs');
//glob = require('glob'),
//_ = require('lodash'),
//projectName = "pay";

module.exports = function(grunt) {
    var file = grunt.file;
    var task = grunt.task;
    var pathname = path.basename(__dirname);
    //var source_files = clamUtil.walk('src',
    //    clamUtil.NORMAL_FILTERS,
    //    clamUtil.NORMAL_EXFILTERS);
    //var all_files = (source_files.css || [])
    //    .concat(source_files.eot || [])
    //    .concat(source_files.otf || [])
    //    .concat(source_files.svg || [])
    //    .concat(source_files.ttf || [])
    //    .concat(source_files.woff || [])
    //    .concat(source_files.html || [])
    //    .concat(source_files.htm || [])
    //    .concat(source_files.js || [])
    //    .concat(source_files.less || [])
    //    .concat(source_files.css || [])
    //    .concat(source_files.png || [])
    //    .concat(source_files.gif || [])
    //    .concat(source_files.jpg || [])
    //    .concat(source_files.scss || [])
    //    .concat(source_files.php || [])
    //    .concat(source_files.swf || [])
    //    .concat(source_files.ico || [])
    //    .concat(source_files.json || [])
    //    .concat('!**/*/build/**');

    var relative = '';
    var base = '://cdn.huangbaoche.com';
    var pkg = grunt.file.readJSON('abc.json');
    var daily = true; //是否解析css中的image
    var version = pkg.version;
    var versionTemp = pkg.version;


    var config = {
        pkg: grunt.file.readJSON('abc.json'),
        currentBranch: version || 'master',

        template: {
            dev: {
                'options': {
                    'data': {
                        'domainHost': 'https://www-dev.yundijie.com/',
                        'apiHost': 'https://www-dev.yundijie.com/',
                        'openApiHost': 'https://api7-dev.huangbaoche.com/',
                        'api7Host': 'https://api7-dev.huangbaoche.com/',
                        'frHost': 'https://fr-dev.huangbaoche.com/',
                        'pay': 'https://op-dev.huangbaoche.com/app/index.html', // 收银台
                        'cdnHost': 'https://m-dev.huangbaoche.com/',
                        'wxAuth': "https://op-test.huangbaoche.com/app/auth.html",
                        'wxAppId': "wx1354271c597184ee",
                        "wxApiHost": "https://api7-dev.huangbaoche.com/",
                        "storagePrefix": "dev_ydj_",
                        'fileHost': 'https://hbcdn-dev.huangbaoche.com/',
                    }
                },
                'files': {
                    'src/widgets/apiConfig/index.js': ['src/widgets/apiConfig/index.tpl']
                }
            },
            test: {
                'options': {
                    'data': {
                        'domainHost': 'https://www-test.yundijie.com/',
                        'apiHost': 'https://www-test.yundijie.com/',
                        'openApiHost': 'https://api7-test.huangbaoche.com/',
                        'api7Host': 'https://api7-test.huangbaoche.com/',
                        'frHost': 'https://fr-test.huangbaoche.com/',
                        'pay': 'https://op-test.huangbaoche.com/app/index.html', // 收银台
                        'cdnHost': 'https://m-test.huangbaoche.com/',
                        'wxAuth': "https://op-test.huangbaoche.com/app/auth.html",
                        'wxAppId': "wx1354271c597184ee",
                        "wxApiHost": "https://api7-test.huangbaoche.com/",
                        "storagePrefix": "test_ydj_",
                        'fileHost': 'https://hbcdn-test.huangbaoche.com/',
                    }
                },
                'files': {
                    'src/widgets/apiConfig/index.js': ['src/widgets/apiConfig/index.tpl']
                }
            },
            pub: {
                'options': {
                    'data': {
                        'domainHost': 'https://www.yundijie.com/',
                        "apiHost": "https://www.yundijie.com/",
                        'openApiHost': 'https://openapi.huangbaoche.com/',
                        'api7Host': 'https://api7.huangbaoche.com/',
                        'frHost': 'https://fr-static.huangbaoche.com/',
                        'pay': 'https://op.huangbaoche.com/app/index.html', // 收银台
                        'cdnHost': 'https://fr-static.huangbaoche.com/',
                        'wxAuth': "https://op.huangbaoche.com/app/auth.html",
                        'wxAppId': "wx1354271c597184ee",
                        "wxApiHost": "https://api7.huangbaoche.com/",
                        "storagePrefix": "pub_ydj_",
                        'fileHost': 'https://hbcdn.huangbaoche.com/',
                    }
                },
                'files': {
                    'src/widgets/apiConfig/index.js': ['src/widgets/apiConfig/index.tpl']
                }
            }
        },

        clean: {
            src: {
                src: ['dist/static/**/*'],
                filter: 'isFile'
            }
        },

        exec: {
            tag: {
                command: 'git tag publish/<%= currentBranch %>'
            },
            publish: {
                command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
            },
            commit: {
                command: function(msg) {
                    console.log(grunt.config.get('currentBranch'))
                    var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
                    return command;
                }
            },
            mastercommit: {
                command: function(msg) {

                    var command = 'git commit -m "' + '' + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
                    return command;
                }
            },
            push: {
                command: 'git push origin master'
            },
            add: {
                command: 'git add .'
            },
            prepub: {
                command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
            },
            push_daily: {
                command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
            },
            grunt_publish: {
                command: function(msg) {
                    return 'grunt default:publish:' + msg;
                }
            },
            grunt_prepub: {
                command: function(msg) {
                    return 'grunt default:prepub:' + msg;
                }
            },
            new_branch: {
                command: 'git checkout -b daily/<%= currentBranch %>'
            },
            master: {
                command: 'git checkout master'
            },

            merge: {
                command: 'git merge daily/<%= currentBranch %>'
            },
            deletebranch: {
                command: 'git push origin --delete  daily/<%= currentBranch %> '
            },
            daily: {
                command: 'grunt daily'
            }
        },
    };

    grunt.initConfig(config);


    // 默认构建任务
    grunt.registerTask('build', 'build to publish', function() {
        setEvn('publish');
        var action = ['prompt:grunt_default', 'prompt:uglify', 'exec_build'];
        task.run(action);
    });


    grunt.registerTask('clean', 'clean build', function() {
        task.run(["clean"]);
    });

    grunt.registerTask('tpl', 'clean build', function() {
        task.run(["template:dev"]);
    });

    grunt.registerTask('dev', 'clean build', function() {
        task.run(["clean", "template:dev"]);
    });
    grunt.registerTask('test', 'clean build', function() {
        // task.run(["clean", "template:test"]);
        task.run(["template:test"]);
    });
    grunt.registerTask('pub', 'clean build', function() {
        task.run(["clean", "template:pub"]);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-template');
    // grunt.loadNpmTasks('grunt-template');



    grunt.registerTask('push', '提交代码仓库', function(msg) {
        task.run(['exec:add', 'exec:commit:' + ("--deploy&project--" + msg || pkg.author.name)]);
        task.run(['exec:prepub']);
    });

    grunt.registerTask('tag', '打tag', function(msg) {
        task.run(['exec:add', 'exec:commit:' + ("--publish&project:" + msg || pkg.author.name), 'exec:push_daily']);
        task.run(['exec:tag', 'exec:publish']);
    });
    /*
     * 获取当前最大版本号，并创建新分支
     **/
    grunt.registerTask('newbranch', '创建新的分支', function(msg) {
        var done = this.async();
        exec('git branch -a & git tag', function(err, stdout, stderr, cb) {
            var r = clamUtil.getBiggestVersion(stdout.match(/\d+\.\d+\.\d+/ig));
            if (!r) {
                r = '0.1.0';
            } else {
                console.log(r)
                r[2]++;
                console.log(r)
                r = r.join('.');
            }
            grunt.log.write(('新分支：daily/' + r).green);
            grunt.config.set('currentBranch', r);
            task.run(['exec:new_branch']);
            // 回写入 abc.json 的 version
            try {
                abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
                abcJSON.version = r;
                clamUtil.fs.writeJSONFile("abc.json", abcJSON, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("update abc.json.");
                        task.run(['exec:add', 'exec:commit:' + ("--newbranch&project:" + msg || pkg.author.name), 'exec:push_daily']);
                    }
                });
            } catch (e) {
                console.log('未找到abc.json');
            }

            done();
        });
    });
}
