var opticDrive = (function()
{
    var OpTicDrive = {};

    var log = require("../logger.js");
    var fs = require("fs");
    var readline = require("readline");
    var google = require("googleapis");
    var googleAuth = require("google-auth-library");

    var templateFolder = "0ByYWqFGhfMicb1gzRk16OHJOSkE";

    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/drive-nodejs-quickstart.json
    var SCOPES = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly"];
    var TOKEN_DIR = __dirname + "../../../config/.credentials/";
    var TOKEN_PATH = TOKEN_DIR + "optic-drive.json";


    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback)
    {
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, function(err, token) {
        if(err)
        {
          getNewToken(oauth2Client, callback);
        }
        else
        {
          oauth2Client.credentials = JSON.parse(token);
          callback(oauth2Client);
        }
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback)
    {
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });

      log.important("Authorize this app by visiting this url: " + authUrl);

      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Enter the code from that page here: ', function(code)
      {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
          if(err)
          {
            log.error('Error while trying to retrieve access token' + err);
            return;
          }

          oauth2Client.credentials = token;
          storeToken(token);
          callback(oauth2Client);
        });
      });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token)
    {
      try
      {
        fs.mkdirSync(TOKEN_DIR);
      }
      catch(err)
      {
        if (err.code != "EEXIST")
        {
            log.error("Error trying to make token dir");
            throw err;
        }
      }
      fs.writeFile(TOKEN_PATH, JSON.stringify(token));
      log.info('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listFiles(auth)
    {
      var service = google.drive('v3');
      service.files.list({
        auth: auth,
        pageSize: 50,
        fields: "nextPageToken, files(id, name)"
      }, function(err, response) {
        if(err)
        {
          log.error("The API returned an error: " + err);
          return;
        }
        var files = response.files;
        if(files.length == 0)
        {
          log.info("No files found.");
        }
        else
        {
          log.info('Files:');
          for (var i = 0; i < files.length; i++)
          {
            var file = files[i];
            log.info(file.name + "(" + file.id + ")");
          }
        }
      });
    }

    OpTicDrive.findFile = function(filename)
    {
        // Load client secrets from a local file.
        fs.readFile("./config/client_secret.json", function processClientSecrets(err, content)
        {
            if (err)
            {
                log.error("Error loading client secret file: " + err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the
            // Drive API.
            //authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), function(auth)
            {
                fetchPage(filename, auth, null, fetchPage, function(err, file) {
                    if(err !== null)
                    {
                        // Handle error
                        log.error("Error in fetchPage: " + err);
                    }
                    else
                    {
                        if(typeof file !== "undefined" && file !== null)
                        {
                            // getFileContent(file.webContentLink, function()
                            // {
                            //     log.info(result);
                            // });
                        }
                    }
                });
            });
        });
    };

    var getFileContent = function(url, callback)
    {
        //https://developers.google.com/drive/v3/web/manage-downloads#using_altmedia
        var request = require("request");
        request({
            url: url,
            encoding: null
        }, function(err, res, body)
        {
            log.info(res.body);
        });
    };

    var fetchPage = function(filename, auth, pageToken, pageFn, callback)
    {
        var drive = google.drive("v3");
        drive.files.list({
            auth: auth,
            q: "mimeType='text/plain' and name contains '" + filename + "' and '" + templateFolder + "' in parents",
            fields: "nextPageToken, files(id, name, webContentLink)",
            spaces: "drive",
            pageToken: pageToken
        }, function(err, res) {
            if(err)
            {
              callback(err);
            }
            else
            {
                if(res.files.length > 0)
                {
                    //return first file found
                    var file = res.files[0];
                    log.info(JSON.stringify(file));
                    log.info("Found file: " + file.name + " - " + file.id);
                    callback(null, file);
                }

                /*res.files.forEach(function(file){
                    log.info("Found file: " + file.name + " - " + file.id);
                });

                if(res.nextPageToken)
                {
                    log.info("Page token" + res.nextPageToken);
                    pageFn(filename, auth, res.nextPageToken, pageFn, callback);
                }
                else
                {
                    callback();
                }*/
            }
        });
    };

    return OpTicDrive;
}());

module.exports = opticDrive;
