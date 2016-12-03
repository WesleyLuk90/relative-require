var Q = require('q')
var fs = require('fs')
var path = require('path')

module.exports = function(projectPath) {
    var deferred = Q.defer()

    fs.readFile(path.join(projectPath, 'package.json'), 'utf8', function(error, data) {
        if (error) return deferred.resolve([])
        data = JSON.parse(data)
        deferred.resolve(data)
    })

    return deferred.promise
}
