pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'b3c2c3e7-e621-4049-b4e2-3b12f6f29d45'
        NETLIFY_AUTH_TOKEN = credentials('netlify-pat')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }

        stage('Tests') {
            parallel {
                stage('Unit tests') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                            #test -f build/index.html
                            npm test
                        '''
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }

                stage('E2E') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test  --reporter=html
                        '''
                    }

                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Local E2E', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }

        stage('Deploy staging') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            environment {
                CI_ENVIRONMENT_URL = 'STAGING_URL_TO_BE_SET'
            }

            steps {
                sh '''
                    npm install netlify-cli node-jq
                    node_modules/.bin/netlify --version
                    echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --json > deploy-output.json
                    CI_ENVIRONMENT_URL=$(node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json)
                    npx playwright test  --reporter=html
                '''
            }

            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }

        // stage('Approval') {
        //     steps {
        //         timeout(time: 15, unit: 'MINUTES') {
        //             input message: 'Do you wish to deploy to production?', ok: 'Yes, I am sure!'
        //         }
        //     }
        // }

        stage('Deploy prod') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            environment {
                CI_ENVIRONMENT_URL = 'https://frabjous-capybara-a54b3f.netlify.app'
            }

            steps {
                sh '''
                    node --version
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --prod
                    npx playwright test  --reporter=html
                '''
            }

            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }
    }

    // stages {
    //     stage('Build') {
    //         agent {
    //             docker {
    //                 image 'node:18-alpine'
    //                 reuseNode true
    //             }
    //         }

    //         steps {
    //             sh '''
    //                 echo 'Small change'
    //                 ls -la
    //                 node --version
    //                 npm --version
    //                 npm ci
    //                 npm run build
    //                 ls -la
    //             '''
    //         }
    //     }

    //     stage('Tests') {
    //         parallel {
    //             stage('Unit Tests') {
    //                 agent {
    //                     docker {
    //                         image 'node:18-alpine'
    //                         reuseNode true
    //                     }
    //                 }

    //                 steps {
    //                     sh '''
    //                         test -f build/index.html
    //                         npm test
    //                     '''
    //                 }

    //                 post {
    //                     always {
    //                         junit 'jest-results/junit.xml'
    //                     }
    //                 }
    //             }

    //             stage('Local E2E') {
    //                 agent {
    //                     docker {
    //                         image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
    //                         reuseNode true
    //                     }
    //                 }

    //                 steps {
    //                     sh '''
    //                         npm install serve
    //                         node_modules/.bin/serve -s build &
    //                         sleep 10
    //                         npx playwright test --reporter=html
    //                     '''
    //                 }

    //                 post {
    //                     always {
    //                         publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local E2E Report', reportTitles: '', useWrapperFileDirectly: true])
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     stage('Deploy') {
    //         agent {
    //             docker {
    //                 image 'node:18-alpine'
    //                 reuseNode true
    //             }
    //         }

    //         steps {
    //             sh '''
    //                 npm install netlify-cli
    //                 node_modules/.bin/netlify --version
    //                 echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
    //                 node_modules/.bin/netlify status
    //                 node_modules/.bin/netlify deploy --dir=build --prod
    //             '''
    //         }
    //     }

    //     stage('Prod E2E') {
    //         agent {
    //             docker {
    //                 image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
    //                 reuseNode true
    //             }
    //         }

    //         environment {
    //             CI_ENVIRONMENT_URL = 'https://frabjous-capybara-a54b3f.netlify.app'
    //         }

    //         steps {
    //             sh '''
    //                 npx playwright test --reporter=html
    //             '''
    //         }

    //         post {
    //             always {
    //                 publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Prod E2E Report', reportTitles: '', useWrapperFileDirectly: true])
    //             }
    //         }
    //     }
    // }
}