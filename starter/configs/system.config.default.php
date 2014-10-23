<?php
/**
 * Base configuration
 *
 * @copyright 2014 Energine
 */
return array(
    // project name
    'project' => 'Energine',

    // $energine_release - absolute kernel path
    // $setup_dir - absolute setup path
    'setup_dir' => ($energine_release = '/var/www/energine') . '/setup',

    // modules used in current project
    // key - module name, value - absolute path to module
    //$module_path - absolute path to modules
    'modules' => array(
        'share'     => ($module_path = $energine_release . '/core/modules/').'share',
        'user'      => $module_path . 'user',
        'apps'      => $module_path . 'apps',
        'forms'     => $module_path . 'forms',
        'seo'       => $module_path . 'seo',
        'calendar'  => $module_path . 'calendar',
        'comments'  => $module_path . 'comments',
    ),

    // database connection settings
    'database' => array(
        'host' => 'DB HOST NAME',
        'port' => '3306',
        'db' => 'DB NAME',
        'username' => 'DB LOGIN',
        'password' => 'DB PASSWORD'
    ),

    // site settings
    'site' => array(
        // domain name e.g.: energine.net
        'domain' => 'PROJECT DOMAIN NAME',
        // project's path e.g.:'/mysite/' for site located at http://energine.net/sites/
        'root' => '/',
        // debug mode - for production must be 0
        'debug' => 1,
        // render time  - if 1 - header X-Timer contains rending time value
        'useTimer' => 1,
        // show output as XML
        'asXML' => 0,
        // 1 - if you are using tidy
        'aggressive_cleanup' => 1,
        // if you need to put some data from config directly into XML document
        /*
        'vars' => array(
            'SOME_GLOBAL_XML_VARIABLE' => 'some constant value',
            'ANOTHER_GLOBAL_XML_VARIABLE' => 'another value',
        ),
        */
    ),
    // document settings
    'document' => array(
        // XSLT template file name  = site/modules/main/transformers/main.xslt
        'transformer' => 'main.xslt',
    ),

    // thumbnail sizes
    'thumbnails' => array(
        'auxmiddle' => array(
            'width' => 190,
            'height' => 132,
        ),
        'middle' => array(
            'width' => 184,
            'height' => 138,
        ),
        'anchormiddle' => array(
            'width' => 190,
            'height' => 192,
        ),
        'anchorxsmall' => array(
            'width' => 48,
            'height' => 48,
        ),
        'small' => array(
            'width' => 140,
            'height' => 107,
        ),
        'xsmall' => array(
            'width' => 75,
            'height' => 56,
        ),
        'xxsmall' => array(
            'width' => 60,
            'height' => 45,
        ),
        'big' => array(
            'width' => 650,
            'height' => 367,
        ),
    ),
    // SN settings for auth
    /*'auth' => array(
        // VK.COM
        'vk' => array(
            'appID' => 'VK APP ID',
            'secretKey' => 'VK SECRET'
        ),
        // FACEBOOK.COM
        'facebook' => array(
            'appID' => 'FACEBOOK APP ID',
            'secretKey' => 'FACEBOOK SECRET'
        ),
    ),*/

    // PHP's session settings
    'session' => array(
        //Session's timeout
        'timeout' => 6000,
        // lifetime of the cookie in seconds - http://php.net/manual/en/session.configuration.php#ini.session.cookie-lifetime
        'lifespan' => 108000,
    ),

    // mail settings
    'mail' => array(
        // from address
        'from' => 'noreply@energine.net',
        // feedback address
        'feedback' => 'demo@energine.net'
    ),

    // google's services settings
    /**
     * Google verify and google analytics settings
     * must be implemented through site properties
     * @deprecated
     */
    'google' => array(
        'verify' => '',
        'analytics' => ''
    ),

    // recaptcha settings recaptcha.net
    'recaptcha' => array(
        'public' => '6LfkCeASAAAAALl-av9HM_RG1AU-tcta3teX7Z2u',
        'private' => '6LfkCeASAAAAABPo4F3GoXULR2w5EgHjjd3RDjXk'
    ),

    // File repositories settings
    'repositories' => array(
        // file repositories types(share_uploads.upl_mime_type) mapping to repository implementation class name (IFileRepository)
        'mapping' => array(
            'repo/local' => 'FileRepositoryLocal',
            'repo/ftp' => 'FileRepositoryFTP',
            'repo/ftpro' => 'FileRepositoryFTPRO',
            'repo/ro' => 'FileRepositoryRO',
        ),
        // quick upload path
        'quick_upload_path' => 'uploads/public',
        // only for FTP repos
        'ftp' => array(
            //share_uploads.upl_path uploads/ftp
            'uploads/ftp' => array(
                'media' => array(
                    'server' => '10.0.1.10',
                    'port' => 21,
                    'username' => 'username',
                    'password' => 'password'
                ),
                'alts' => array(
                    'server' => '10.0.1.10',
                    'port' => 21,
                    'username' => 'username',
                    'password' => 'password',
                )
            ),
            // share_uploads.upl_path uploads/ftpro
            'uploads/ftpro' => array(
                'media' => array(
                    'server' => '10.0.1.10',
                    'port' => 21,
                    'username' => 'username',
                    'password' => 'password'
                ),
                'alts' => array(
                    'server' => '10.0.1.10',
                    'port' => 21,
                    'username' => 'username',
                    'password' => 'password',
                )
            )
        ),
    ),

    // seo settings (need seo module included)
    'seo' => array(
        'sitemapSegment' => 'google-sitemap',
        'sitemapTemplate' => 'google_sitemap',
        'maxVideosInMap' => '10'
    ),

    // user defined styles for WYSIWYG editor
    /*'wysiwyg' => array(
        'styles' => array(
            'p.red' => array(
                'element' => 'p',
                'class' => 'red',
                'caption' => 'TXT_RED_PARAGRAPH'
            ),
            'p.underline' => array(
                'element' => 'p',
                'class' => 'underline',
                'caption' => 'TXT_TEXT_UNDERLINE'
            )
        )
    ),*/

);

