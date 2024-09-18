pipeline {
    agent any

    environment {
        REACT_APP_VERSION = '1.0.$BUILD_ID'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
    }

    stages {
        stage('Deploy to AWS') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    reuseNode true
                    args "-u root --entrypoint=''"
                }
            }

            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-secret', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                        aws --version
                        yum install jq -y
                        LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition-v2.json | jq '.taskDefinition.revision')
                        echo $LATEST_TD_REVISION
                        aws ecs update-service --cluster jenkins-app --service jenkins-app-service --task-definition JenkinsApp-TaskDefinition-v2:$LATEST_TD_REVISION
                    '''
                }
            }
        }

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

        // stage('Tests') {
        //     parallel {
        //         stage('Unit tests') {
        //             agent {
        //                 docker {
        //                     image 'node:18-alpine'
        //                     reuseNode true
        //                 }
        //             }

        //             steps {
        //                 sh '''
        //                     #test -f build/index.html
        //                     npm test
        //                 '''
        //             }

        //             post {
        //                 always {
        //                     junit 'jest-results/junit.xml'
        //                 }
        //             }
        //         }

        //         stage('E2E') {
        //             agent {
        //                 docker {
        //                     image 'my-app'
        //                     reuseNode true
        //                 }
        //             }

        //             steps {
        //                 sh '''
        //                     serve -s build &
        //                     sleep 10
        //                     npx playwright test --reporter=html
        //                 '''
        //             }

        //             post {
        //                 always {
        //                     publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Local E2E', reportTitles: '', useWrapperFileDirectly: true])
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Deploy staging') {
        //     agent {
        //         docker {
        //             image 'my-app'
        //             reuseNode true
        //         }
        //     }

        //     environment {
        //         CI_ENVIRONMENT_URL = 'STAGING_URL_TO_BE_SET'
        //     }

        //     steps {
        //         sh '''
        //             netlify --version
        //             echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
        //             netlify status
        //             netlify deploy --dir=build --json > deploy-output.json
        //             CI_ENVIRONMENT_URL=$(jq -r '.deploy_url' deploy-output.json)
        //             npx playwright test --reporter=html
        //         '''
        //     }

        //     post {
        //         always {
        //             publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
        //         }
        //     }
        // }

        // stage('Deploy prod') {
        //     agent {
        //         docker {
        //             image 'my-app'
        //             reuseNode true
        //         }
        //     }

        //     environment {
        //         CI_ENVIRONMENT_URL = 'https://frabjous-capybara-a54b3f.netlify.app'
        //     }

        //     steps {
        //         sh '''
        //             node --version
        //             netlify --version
        //             echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
        //             netlify status
        //             netlify deploy --dir=build --prod
        //             npx playwright test  --reporter=html
        //         '''
        //     }

        //     post {
        //         always {
        //             publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
        //         }
        //     }
        // }
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