def remote = [:]
remote.name = "ubuntu"
remote.host = "15.206.15.125"
remote.allowAnyHosts = true

node {

        stage ('Compile Stage') {

            echo "compiling"
            echo "compilation completed"
        }

        stage ('Testing Stage') {

            echo "testing completed"
            echo "testing completed"
        }
        stage("Deploy") {
                withCredentials([sshUserPrivateKey(credentialsId: 'treasure_hunt_key_id', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'ubuntu')]) {
                                  remote.user = ubuntu
                                  remote.identityFile = identity

                                  sshCommand remote: remote, command: 'echo deployment completed !'
                              }
            }
}