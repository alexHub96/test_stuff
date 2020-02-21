const modal = $.modal(
    {
        title: 'my title',
        body: `<p>Lorem ipsum dolor sit amet.</p>`,
        closable: true,
        width: '400px',
        footerButtons: [
            {
                title: 'Ok',
                type: 'primary',
                handler() {
                   modal.close()
                }
            },
            {
                title: 'Cancel',
                type: 'secondary',
                handler() {
                    modal.close()
                }
            }
        ]
    });
