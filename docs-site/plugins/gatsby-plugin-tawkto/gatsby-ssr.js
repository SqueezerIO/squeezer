import React from 'react';

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  if (process.env.NODE_ENV === `production`) {
    return setPostBodyComponents([
      <script
        key={`gatsby-plugin-tawkto`}
        dangerouslySetInnerHTML={{
          __html: `
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          
          (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/${pluginOptions.widgetId}/default';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
          `,
        }}
      />,
    ]);
  }
};