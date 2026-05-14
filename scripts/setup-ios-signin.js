const xcode = require('xcode');
const fs = require('fs');

const projectPath = 'ios/App/App.xcodeproj/project.pbxproj';
const project = xcode.project(projectPath);

project.parseSync();

const entitlementPath = 'App/App.entitlements';

project.addBuildProperty(
  'CODE_SIGN_ENTITLEMENTS',
  entitlementPath
);

fs.writeFileSync(projectPath, project.writeSync());

const entitlementContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
</dict>
</plist>`;

fs.writeFileSync(
  'ios/App/App/App.entitlements',
  entitlementContent
);

console.log('✅ Apple Sign In entitlement configured');