module.exports = function applyAvatarEditorTests(provideAvatarEditor) {
  var avatarEditor;
  beforeEach(function() {
    avatarEditor = provideAvatarEditor();
    if(!avatarEditor || !avatarEditor.avatar || !avatarEditor.randomizeAvatar) throw new Error();
  });

  it('should have a default avatar image and "randomize" button', function() {
    expect(avatarEditor.avatar.isPresent()).toBe(true);
    expect(avatarEditor.avatar.getAttribute('src')).toContain('://');
    expect(avatarEditor.randomizeAvatar.isPresent()).toBe(true);
  });

  describe('"Randomize" button', function() {
    it('should work', function() {
      var originalSrc;
      protractor.promise.controlFlow().execute(function() {
        return avatarEditor.avatar.getAttribute('src').then(function(src) {
          originalSrc = src;
        });
      });

      avatarEditor.randomizeAvatar.click();

      protractor.promise.controlFlow().execute(function() {
        return avatarEditor.avatar.getAttribute('src').then(function(src) {
          expect(src).not.toBe(originalSrc);
        });
      });
    });
  });
};
